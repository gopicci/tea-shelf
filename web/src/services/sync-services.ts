import { APIRequest } from "./auth-services";
import localforage from "localforage";
import { TeaInstance, SubcategoryModel, VendorModel } from "./models";

/**
 * Models allowed to be used in the generic services requiring an instance ID.
 */
type genericModels = TeaInstance | SubcategoryModel | VendorModel;

/**
 * Generic reducer actions.
 */
export type genericAction =
  | { type: "CLEAR" }
  | { type: "SET"; data: genericModels[] }
  | { type: "ADD"; data: genericModels }
  | { type: "EDIT"; data: genericModels }
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
  let i = 0;
  for (const item of array) {
    if (item.id === i) i += 1;
    else return i;
  }
  return i;
}

/**
 * Syncs offline teas from storage to API.
 *
 * @category Services
 */
export async function syncOffline(): Promise<void> {
  const offlineTeas = await localforage.getItem<TeaInstance[]>("offline-teas");

  if (!offlineTeas) return;

  let failed: TeaInstance[] = [];

  const requests = offlineTeas.map(async (tea) => {
    try {
      // Long ID means API generated, instance has been previously uploaded
      if (String(tea.id).length > 5) {
        let req = { ...tea };
        if (req.image) delete req.image;
        await APIRequest(`/tea/${req.id}/`, "PUT", JSON.stringify(req));
      } else {
        await APIRequest("/tea/", "POST", JSON.stringify(tea));
      }
    } catch (e) {
      failed.push(tea);
      console.error(e);
    }
  });

  await Promise.allSettled(requests);

  if (failed.length) {
    await localforage.setItem<TeaInstance[]>("offline-teas", failed);
    throw new Error("Error when uploading local entries");
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
  else
    return Promise.all(cache.filter((entry) => entry.name && entry.category));
}
