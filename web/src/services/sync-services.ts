import localforage from "localforage";
import { APIRequest } from "./auth-services";
import {
  TeaInstance,
  SessionInstance,
  Clock,
  SubcategoryInstance,
  VendorInstance,
  TeaRequest,
  SessionModel,
} from "./models";

/**
 * Models allowed to be used in the generic services requiring an offline instance ID.
 */
type genericModels =
  | TeaInstance
  | SessionInstance
  | SubcategoryInstance
  | VendorInstance
  | Clock;

/**
 * Generic reducer actions.
 */
export type GenericAction =
  /** Clear state and returns an empty array */
  | { type: "CLEAR" }
  /** Set state with array input */
  | { type: "SET"; data: genericModels[] }
  /** Adds a new instance to the array */
  | { type: "ADD"; data: genericModels }
  /** Edits an instance on the array */
  | { type: "EDIT"; data: genericModels }
  /** Deletes an instance from the array */
  | { type: "DELETE"; data: genericModels };

/**
 * Generic object array state reducer, shared by some context providers.
 * Models require a unique id field.
 *
 * @param {genericModels} state - Array of generic models instances
 * @param {GenericAction} action - Action type and data
 * @returns {genericModels[]}
 * @category Services
 */
export function genericReducer(
  state: genericModels[],
  action: GenericAction
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
        item.offline_id === action.data.offline_id ? action.data : item
      );
    case "DELETE":
      let newState = [];
      if (state.length)
        for (const item of state)
          if (item.offline_id !== action.data.offline_id) newState.push(item);
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
    if (item.offline_id === i) i += 1;
    else return i;
  }
  return i;
}

/**
 * Uploads a tea or brewing session instance, returns a response promise.
 *
 * @category Services
 * @param {TeaRequest | SessionModel} data - Request object
 * @param {string} [id] - Optional instance API ID
 * @returns {Promise<Response>}
 */
export async function uploadInstance(
  data: TeaRequest | SessionModel,
  id?: string
): Promise<Response> {
  const endpoint = "category" in data ? "tea" : "brewing_session";

  // String UUID means API generated, instance has been previously uploaded
  if (id) {
    let request = JSON.parse(JSON.stringify({ ...data, id: id }));
    // Remove image from PUT request
    if (request.image) delete request.image;
    return APIRequest(`/${endpoint}/${id}/`, "PUT", JSON.stringify(request));
  } else {
    return APIRequest(`/${endpoint}/`, "POST", JSON.stringify(data));
  }
}

/**
 * Tries to upload offline tea instances from storage to API.
 * If successful releases the cache.
 *
 * @category Services
 */
export async function uploadOfflineTeas(): Promise<void> {
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
 * Tries to upload offline brewing session instances from storage to API.
 * If successful releases the cache.
 *
 * @category Services
 */
export async function uploadOfflineSessions(): Promise<void> {
  const offlineSessions = await localforage.getItem<SessionInstance[]>(
    "offline-sessions"
  );
  if (!offlineSessions) return;

  let failed: SessionInstance[] = [];
  let error = "";

  const requests = offlineSessions.map(async (session) => {
    try {
      await uploadInstance(session);
    } catch (e) {
      // Save failed instance if proper
      if (e.message !== "Bad Request") failed.push(session);
      error = e.message;
    }
  });

  await Promise.allSettled(requests);

  if (failed.length) {
    await localforage.setItem<SessionInstance[]>("offline-sessions", failed);
    throw new Error(error);
  } else {
    await localforage.setItem("offline-sessions", []);
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

/**
 * Gets offline sessions (not uploaded yet) from storage.
 *
 * @returns {Promise<SessionInstance[]>}
 * @category Services
 */
export async function getOfflineSessions(): Promise<SessionInstance[]> {
  const cache = await localforage.getItem<SessionInstance[]>(
    "offline-sessions"
  );
  if (!cache) return localforage.setItem("offline-sessions", []);
  else return Promise.all(cache);
}

/**
 * Deletes tea a instance.
 *
 * @param {TeaInstance} teaData - Tea instance
 * @category Services
 */
export async function deleteTea(teaData: TeaInstance): Promise<void> {
  if (typeof teaData.id === "string")
    // ID is UUID, delete online tea
    await APIRequest(`/tea/${teaData.id}/`, "DELETE");
  else {
    // ID is not UUID, delete offline tea
    const offlineTeas = await localforage.getItem<TeaInstance[]>(
      "offline-teas"
    );
    let newOfflineTeas = [];
    for (const tea of offlineTeas)
      if (tea.id !== teaData.id) newOfflineTeas.push(tea);
    await localforage.setItem("offline-teas", newOfflineTeas);
  }
}
