import { Dispatch } from "react";
import localforage from "localforage";
import { APIRequest } from "./auth-services";
import { getEndDate } from "./parsing-services";
import { HandleSessionEdit } from "../components/edit-session";
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
type GenericModels =
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
  | { type: "SET"; data: GenericModels[] }
  /** Adds a new instance to the array */
  | { type: "ADD"; data: GenericModels }
  /** Edits an instance on the array */
  | { type: "EDIT"; data: GenericModels }
  /** Deletes an instance from the array */
  | { type: "DELETE"; data: GenericModels };

/**
 * Generic object array state reducer, shared by some context providers.
 * Models require a unique id field.
 *
 * @category Services
 * @param {GenericModels} state - Array of generic models instances
 * @param {GenericAction} action - Action type and data
 * @returns {GenericModels[]}
 */
export function genericReducer(
  state: GenericModels[],
  action: GenericAction
): GenericModels[] {
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
 * @category Services
 * @param {GenericModels[]} array - Array of generic models instances
 * @returns {number}
 */
export function generateUniqueId(array: GenericModels[]): number {
  let i = 1;
  for (const item of array) {
    if (item.offline_id >= i) i = item.offline_id + 1;
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
 * Tries to upload teas or brewing sessions offline instances from storage to API.
 * If successful releases the cache.
 *
 * @category Services
 * @param {"tea"|"session"} type - Instance type
 */
export async function uploadOffline(type: "tea" | "session"): Promise<void> {
  // Storage name
  const storage = "offline-" + type + "s";

  const offline = await localforage.getItem<TeaInstance | SessionInstance[]>(
    storage
  );
  if (!offline) return;

  let failed: TeaInstance | SessionInstance[] = [];
  let error = "";

  const requests = offline.map(
    async (instance: TeaInstance | SessionInstance) => {
      try {
        const request = { ...instance, id: undefined, offline_id: undefined };
        await uploadInstance(request, instance.id);
      } catch (e) {
        // Save failed instance if proper
        if (e.message !== "Bad Request") failed.push(instance);
        error = e.message;
      }
    }
  );

  await Promise.allSettled(requests);

  if (failed.length) {
    await localforage.setItem<TeaInstance | SessionInstance[]>(storage, failed);
    throw new Error(error);
  } else {
    await localforage.setItem(storage, []);
  }
}

/**
 * Gets offline teas (not uploaded yet) from storage.
 *
 * @category Services
 * @returns {Promise<TeaInstance[]>}
 */
export async function getOfflineTeas(): Promise<TeaInstance[]> {
  const cache = await localforage.getItem<TeaInstance[]>("offline-teas");
  if (!cache) return localforage.setItem("offline-teas", []);
  else return Promise.all(cache);
}

/**
 * Gets offline sessions (not uploaded yet) from storage.
 *
 * @category Services
 * @returns {Promise<SessionInstance[]>}
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
 * @category Services
 * @param {TeaInstance} teaData - Tea instance
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

/**
 * Updates instances global state, cache first.
 *
 * @category Services
 * @param {"tea"|"session"|"vendor"|"subcategory"} type - Instance type
 * @param {Dispatch<GenericAction>} dispatch - Context dispatch
 */
export async function syncInstances(
  type: "tea" | "session" | "vendor" | "subcategory",
  dispatch: Dispatch<GenericAction>
): Promise<void> {
  // Define storage name and API endpoint
  const storage = type === "subcategory" ? "subcategories" : type + "s";
  const endpoint = type === "session" ? "brewing_session" : type;

  // Get offline instances (new or edits not yet uploaded)
  let offline = await localforage.getItem<GenericModels[]>(
    "offline-" + storage
  );
  if (!offline) offline = [];

  // Get cached API instances if ID not already on offline ones,
  // meaning they've been modified but not uploaded yet
  let cached = await localforage.getItem<GenericModels[]>(storage);
  if (!cached) cached = [];
  else
    cached = cached.filter(
      (c) => !offline.some((o) => o.offline_id === c.offline_id)
    );

  // All locally stored instances
  const locals = offline.concat(cached);

  // Set initial state merging cached data
  dispatch({ type: "SET", data: locals });

  // Get online instances
  const res = await APIRequest(`/${endpoint}/`, "GET");
  const body = await res?.json();

  // Remove API instances present offline and generate offline ID
  let online: GenericModels[] = [];
  if (body) {
    for (const instance of body) {
      // Check that ID not already on offline instances
      if (!offline.some((o) => "id" in o && o.id === instance.id)) {
        const match = Object.values(locals).find(
          (l) => "id" in l && l.id === instance.id
        );
        if (match) {
          // API instance already cached, keep previous offline ID
          online.push({
            ...instance,
            offline_id: match.offline_id,
          });
        } else {
          // New instance, generate new offline ID
          online.push({
            ...instance,
            offline_id: await generateUniqueId(locals.concat(online)),
          });
        }
      }
    }
  }

  if (type === "session") {
    // Remove expired clocks
    // Get clocks from storage
    const clocks = await localforage.getItem<Clock[]>("clocks");

    // Clocks still running
    let running: Clock[] = [];

    for (const clock of clocks) {
      // Find clock session
      const session = Object.values(offline.concat(locals)).find(
        (s) => s.offline_id === clock.offline_id
      ) as SessionInstance;

      if (session) {
        // Determine clock end date
        const endDate = getEndDate(clock.starting_time, session);

        if (endDate < Date.now()) {
          // Clock expired, update session
          offline.map((session) => {
            if (
              session.offline_id === clock.offline_id &&
              "current_infusion" in session
            )
              return {
                ...session,
                current_infusion: session.current_infusion + 1,
              };
            else return session;
          });
          online.map((session) => {
            if (
              session.offline_id === clock.offline_id &&
              "current_infusion" in session
            )
              return {
                ...session,
                current_infusion: session.current_infusion + 1,
              };
            else return session;
          });
        } else {
          // Clock still running
          running.push(clock);
        }
      }
    }
    // Save running clocks to storage
    await localforage.setItem<Clock[]>("clocks", running);
  }

  // Update the state
  dispatch({ type: "SET", data: offline.concat(online) });

  // Update the cache
  await localforage.setItem<GenericModels[]>(storage, online);
}

/**
 * On countdown completion removes clock from global state
 * and cache, then updates brewing session.
 *
 * @category Services
 * @param {Clock} clock - Expired clock
 * @param {SessionInstance} session - Session instance with expired clock
 * @param {Dispatch<GenericAction>} clockDispatch - Clock context dispatch
 * @param {HandleSessionEdit} handleSessionEdit - Session editor callback
 * @param {boolean} [vibrate] - Optional vibration on complete
 */
export async function handleSessionComplete(
  clock: Clock,
  session: SessionInstance,
  clockDispatch: Dispatch<GenericAction>,
  handleSessionEdit: HandleSessionEdit,
  vibrate?: boolean,
) {
  // Remove clock
  await removeClock(clock, clockDispatch);

  // Update session
  await handleSessionEdit(
    {
      ...session,
      current_infusion: session.current_infusion + 1,
      last_brewed_on: new Date(clock.starting_time).toISOString(),
    },
    session.offline_id
  );

  if (vibrate)
    window.navigator.vibrate([200, 200, 200]);
}

/**
 * Deletes session clock instance from global
 * state and cache.
 *
 * @category Services
 * @param {Clock} clock - Clock instance to remove
 * @param {Dispatch<GenericAction>} clockDispatch - Clock context dispatch
 */
export async function removeClock(
  clock: Clock,
  clockDispatch: Dispatch<GenericAction>
) {
  let cachedClocks = await localforage.getItem<Clock[]>("clocks");
  if (cachedClocks)
    await localforage.setItem<Clock[]>(
      "clocks",
      cachedClocks.filter((c) => c.offline_id !== clock.offline_id)
    );
  await clockDispatch({
    type: "DELETE",
    data: clock,
  });
}
