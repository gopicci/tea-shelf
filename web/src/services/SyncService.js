import { APIRequest } from "./AuthService";
import localforage from "localforage";

export function genericReducer(state, action) {
  /**
   * Generic object array state reducer, assumes id field on entries.
   */
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
      let newState = []
      for (const item of state)
          if (item.id !== action.data.id)
            newState.push(item);
      return newState
    default:
      return action;
  }
}

export function generateUniqueId(array) {
  /**
   * Generate unique id from array of objects with id field
   */
  let i = 0;
  for (const item of array) {
    console.log("id", item.id);
    if (item.id === i) i += 1;
    else return i;
  }
  return i;
}

export async function syncOffline() {
  /**
   * Upload offline teas from storage.
   */
  const offlineTeas = await localforage.getItem("offline-teas");

  let failed = [];

  const requests = offlineTeas.map(async (tea) => {
    try {
      if (String(tea.id).length > 5) {
        let req = { ...tea };
        if (req.image) delete req.image;
        console.log("a", JSON.stringify(req));
        await APIRequest(`/tea/${req.id}/`, "PUT", JSON.stringify(req));
      } else {
        console.log("b", JSON.stringify(tea));
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

export async function getOfflineTeas() {
  /**
   * Gets offline teas (not uploaded yet) from storage
   * and return serialized data to match an API response.
   */

  const cache = await localforage.getItem("offline-teas");
  if (!cache) return localforage.setItem("offline-teas", []);
  else
    return Promise.all(
      cache
        .filter((entry) => entry.name && entry.category)
        .map(async (entry) => {
          entry.category = parseInt(entry.category);
          return entry;
        })
    );
}
