import { APIRequest } from "./auth-services";
import localforage from "localforage";
import validator from "validator";
import { TeaInstance, SubcategoryModel, VendorModel } from "./models";
import { brewingTimesToSeconds } from "./parsing-services";

/**
 * Models allowed to be used in the generic services requiring an instance ID.
 */
type genericModels = TeaInstance | SubcategoryModel | VendorModel;

/**
 * Generic reducer actions.
 */
export type genericAction =
  /** Clear state and returns an empty array */
  | { type: "CLEAR" }
  /** Set state with array input */
  | { type: "SET"; data: genericModels[] }
  /** Adds a new instance to the array */
  | { type: "ADD"; data: genericModels }
  /** Edits an instance on the array */
  | { type: "EDIT"; data: genericModels }
  /** Updates the ID of an instance on the array */
  | {
      type: "EDIT_ID";
      data: { instance: genericModels; newID: number | string; };
    }
  /** Deletes an instance from the array */
  | { type: "DELETE"; data: genericModels };

/**
 * Generic object array state reducer, shared by some context providers.
 * Models require a unique id field.
 *
 * @param {genericModels} state - Array of generic models instances
 * @param {genericAction} action - Action type and data
 * @returns {genericModels[]}
 * @category Services
 */
export function genericReducer(
  state: genericModels[],
  action: genericAction
): genericModels[] {
  switch (action.type) {
    case "CLEAR":
      return [];
    case "SET":
      return action.data;
    case "ADD":
      return state?.concat(action.data);
    case "EDIT":
      return state?.map((item) =>
        item.id === action.data.id ? action.data : item
      );
    case "EDIT_ID":
      return state?.map((item) =>
        item.id === action.data.instance.id
          ? { ...action.data.instance, id: action.data.newID }
          : item
      );
    case "DELETE":
      if (state.length < 2) return [];
      let newState = [];
      for (const item of state)
        if (item.id !== action.data.id) newState.push(item);
      return newState;
    default:
      return [];
  }
}

/**
 * Generates new unique ID from array of generic models instances.
 *
 * @param {genericModels[]} array - Array of generic models instances
 * @returns {number}
 * @category Services
 */
export function generateUniqueId(array: genericModels[]): number {
  let i = 1;
  for (const item of array) {
    if (item.id === i) i += 1;
    else return i;
  }
  return i;
}

/**
 * Uploads a tea instance, returns a response promise.
 *
 * @category Services
 * @returns {Promise<Response>}
 */
export async function uploadInstance(tea: TeaInstance): Promise<Response> {
  let request = JSON.parse(JSON.stringify(tea));
  request = brewingTimesToSeconds(request);
  // Remove null fields
  Object.keys(request).forEach(
    (key) => request[key] === null && delete request[key]
  );

  // String UUID means API generated, instance has been previously uploaded
  if (typeof tea.id === "string" && validator.isUUID(tea.id)) {
    // Remove image from PUT request
    if (request.image) delete request.image;
    return APIRequest(`/tea/${request.id}/`, "PUT", JSON.stringify(request));
  } else {
    return APIRequest("/tea/", "POST", JSON.stringify(tea));
  }
}

/**
 * Tries to upload offline teas from storage to API. If successful releases
 * the cache.
 *
 * @category Services
 */
export async function uploadOffline(): Promise<void> {
  const offlineTeas = await localforage.getItem<TeaInstance[]>("offline-teas");

  if (!offlineTeas) return;

  let failed: TeaInstance[] = [];

  let error = "";

  const requests = offlineTeas.map(async (tea) => {
    try {
      await uploadInstance(tea);
    } catch (e) {
      // Save failed instance if proper
      if (e.message !== "Bad Request") failed.push(tea);
      error = e.message;
    }
  });

  await Promise.allSettled(requests);

  if (failed.length) {
    await localforage.setItem<TeaInstance[]>("offline-teas", failed);
    throw new Error(error);
  } else {
    await localforage.setItem("offline-teas", []);
  }
}

/**
 * Gets offline teas (not uploaded yet) from storage.
 *
 * @returns {Promise<TeaInstance[]>}
 * @category Services
 */
export async function getOfflineTeas(): Promise<TeaInstance[]> {
  const cache = await localforage.getItem<TeaInstance[]>("offline-teas");
  if (!cache) return localforage.setItem("offline-teas", []);
  else return Promise.all(cache);
}
