import React, {
  createContext,
  ReactChild,
  ReactElement,
  useContext,
} from "react";
import localforage from "localforage";
import {
  generateUniqueId,
  getOfflineSessions,
  uploadInstance,
} from "../services/sync-services";
import { SnackbarDispatch } from "./statecontainers/snackbar-context";
import {
  SessionDispatch,
  SessionsState,
} from "./statecontainers/session-context";
import { SyncDispatch } from "./statecontainers/sync-context";
import { SessionInstance, SessionModel } from "../services/models";

type Props = {
  children: ReactChild;
};

/**
 * handleSessionEdit function type.
 *
 * @memberOf EditSession
 */
export type HandleSessionEdit = (
  /** Request data. */
  data: SessionModel,
  /** Optional ID for editing request. */
  offline_id?: number,
  /** Optional snackbar success message */
  message?: string
) => void;

export const SessionEditorContext = createContext({} as HandleSessionEdit);

/**
 * Provides brewing session instance editing to components that needs it.
 *
 * @component
 * @subcategory Main
 */
function EditSession({ children }: Props): ReactElement {
  const snackbarDispatch = useContext(SnackbarDispatch);
  const sessions = useContext(SessionsState);
  const sessionDispatch = useContext(SessionDispatch);
  const syncDispatch = useContext(SyncDispatch);

  /**
   * Handles brewing session instance edit/creation process. Updates state and saves instance locally
   * first. Then tries to sync local cache with API.
   */
  const handleSessionEdit: HandleSessionEdit = async (
    data,
    offline_id,
    message
  ): Promise<void> => {
    try {
      let offlineSessions = await getOfflineSessions();
      let date = new Date().toISOString();
      let id = offline_id;
      let apiId = "";

      // Update context with request
      if (id) {
        const instance = Object.values(sessions).find(
          (s) => s.offline_id === id
        );
        if (instance && instance.id) apiId = instance.id;
        sessionDispatch({ type: "EDIT", data: { ...data, offline_id: id } });
      } else {
        id = await generateUniqueId(sessions);
        sessionDispatch({
          type: "ADD",
          data: { ...data, offline_id: id, created_on: date },
        });
      }

      // If session already present in cache remove before adding the updated one
      for (const session of offlineSessions)
        if (session.offline_id === id) {
          date = String(session.created_on);
          offlineSessions.splice(offlineSessions.indexOf(session), 1);
        }

      await localforage.setItem<SessionInstance[]>("offline-sessions", [
        ...offlineSessions,
        { ...data, offline_id: id, created_on: date },
      ]);

      syncDispatch({ type: "SET_NOT_SYNCED" });

      // Upload through API
      const response = await uploadInstance(data, apiId);
      const body = await response.json();

      // Update global state
      sessionDispatch({ type: "EDIT", data: { ...body, offline_id: id } });

      // Delete offline entry
      for (const session of offlineSessions)
        if (session.offline_id === id)
          offlineSessions.splice(offlineSessions.indexOf(session), 1);
      await localforage.setItem<SessionInstance[]>(
        "offline-sessions",
        offlineSessions
      );

      // Update sync status
      syncDispatch({ type: "SET_SYNCED" });

      // Notify on success
      if (message)
        snackbarDispatch({
          type: "SUCCESS",
          data: message,
        });
    } catch (e) {
      if (e.message === "Bad Request")
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      else
        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally.",
        });
    }
  };

  return (
    <SessionEditorContext.Provider value={handleSessionEdit}>
      {children}
    </SessionEditorContext.Provider>
  );
}

export default EditSession;
