import { APIRequest } from "./AuthService";
import localforage from "localforage";
import { TeaModel } from './models';

/**
 * Generic object array state reducer, assumes id field on entries.
 *
 * @param state {Array} Objects array
 * @param action {{type: string, data: json}} Action type and data
 */
export function genericReducer(state, action) {
  switch (action.type) {
    case "CLEAR":
      return null;
    case "SET":
      return action.data;
    case "ADD":
      return state.concat(action.data);
    case "EDIT":
      return state.map((item) =>
        item.id === action.data.id ? action.data : item
      );
    case "DELETE":
      let newState = [];
      for (const item of state)
        if (item.id !== action.data.id) newState.push(item);
      return newState;
    default:
      return action;
  }
}

/**
 * Generates new unique id from array of objects with id field.
 *
 * @param array {Array} Objects array
 */
export function generateUniqueId(array) {
  let i = 0;
  for (const item of array) {
    if (item.id === i) i += 1;
    else return i;
  }
  return i;
}

/**
 * Syncs offline teas from storage.
 */
export async function syncOffline() {
  const offlineTeas = await localforage.getItem("offline-teas");

  if (!offlineTeas) return;

  let failed = [];

  const requests = offlineTeas.map(async (tea) => {
    try {
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
    await localforage.setItem("offline-teas", failed);
    throw new Error("Error when uploading local entries");
  } else {
    await localforage.setItem("offline-teas", []);
  }
}

/**
 * Gets offline teas (not uploaded yet) from storage.
 */
export async function getOfflineTeas() {
  const cache = await localforage.getItem<TeaModel[]>("offline-teas");
  if (!cache) return localforage.setItem("offline-teas", []);
  else
    return Promise.all(
      cache
        .filter((entry) => entry.name && entry.category)
    );
}
