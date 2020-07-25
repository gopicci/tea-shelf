import { APIRequest } from "./AuthService";
import localforage from "localforage";

export function genericReducer(state, action) {
  /**
   * Generic array state reducer.
   */
  switch (action.type) {
    case "CLEAR":
      return null;
    case "SET":
      return action.data;
    case "ADD":
      return state.concat(action.data);
    default:
      return action;
  }
}

export async function syncOffline() {
  /**
   * Upload offline teas from storage.
   */
  const offlineTeas = await localforage.getItem("offline-teas");

  let failed = [];

  const requests = offlineTeas.map(async (tea) => {
    try {
      await APIRequest("/tea/", "POST", JSON.stringify(tea));
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

export async function getOfflineTeas() {
  /**
   * Gets offline teas (not uploaded yet) from storage
   * and return serialized data to match an API response.
   */

  const cache = await localforage.getItem("offline-teas");
  if (!cache)
    return localforage.setItem("offline-teas", []);
  else
    return Promise.all(
      cache.map(async (entry) => {
        entry.category = parseInt(entry.category);
        return entry;
      })
    );
}
