import { APIRequest } from "./AuthService";
import localforage from "localforage";
import {FileToBase64} from './ImageService';

export function genericReducer(state, action) {
  switch (action.type) {
    case "CLEAR":
      return null;
    case "SET":
      return action.data;
    default:
      return action;
  }
};


export async function syncOffline() {
  // upload offline teas
  const offlineTeas = await localforage.getItem("offline-teas");

  let failed = []

  const requests = offlineTeas.map(async tea => {
    let formData = new FormData();
    Object.entries(tea).map(([key, value]) => formData.append(key, value));
    try {
      await APIRequest("/tea/", "POST", formData);
    } catch (e) {
      failed.push(Object.fromEntries(formData));
      console.error(e);
    }
  });

  await Promise.allSettled(requests);

  if (failed.length) {
    await localforage.setItem("offline-teas", failed);
    throw new Error('Error when uploading local entries');
  } else {
    await localforage.setItem("offline-teas", []);
  }

}

export async function getOfflineTeas() {
  /**
   * Gets offline teas (not uploaded yet) from storage and serializes
   * the data to match an API response.
   */

  const cache = await localforage.getItem("offline-teas");
  if (!cache)
    // Create an empty array storage entry
    return localforage.setItem("offline-teas", []);
  // Serialize the data converting File blob to base64
  else
    return Promise.all(
      cache.map(async (entry) => {
        if (entry.image) {
          try {
            entry.image = await FileToBase64(entry.image);
          } catch (e) {
            console.error(e);
          }
        }
        entry.category = parseInt(entry.category);
        return entry;
      })
    );
}