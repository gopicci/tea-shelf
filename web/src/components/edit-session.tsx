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
import { TeaDispatch } from "./statecontainers/tea-context";
import { SessionDispatch } from "./statecontainers/session-context";
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
export type handleSessionEdit = (
  /** Request data. */
  data: SessionModel,
  /** Optional ID for editing request. */
  id?: number | string,
  /** Optional snackbar success message */
  message?: string
) => void;

export const EditorContext = createContext({} as handleSessionEdit);

/**
 * Provides brewing session instance editing to components that needs it.
 *
 * @component
 * @subcategory Main
 */
function EditSession({ children }: Props): ReactElement {
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const sessionDispatch = useContext(SessionDispatch);
  const syncDispatch = useContext(SyncDispatch);

  /**
   * Handles brewing session instance edit/creation process. Updates state and saves instance locally
   * first. Then tries to sync local cache with API.
   */
  const handleSessionEdit: handleSessionEdit = async (
    sessionData,
    id,
    message
  ): Promise<void> => {
    try {
      let offlineSessions = await getOfflineSessions();

      // Update context with request
      if (id)
        sessionDispatch({ type: "EDIT", data: { ...sessionData, id: id } });
      else {
        id = generateUniqueId(offlineSessions);
        sessionDispatch({ type: "ADD", data: { ...sessionData, id: id } });
      }

      // If session already present in cache remove before adding again
      for (const session of offlineSessions)
        if (session.id === id)
          offlineSessions.splice(offlineSessions.indexOf(session), 1);

      await localforage.setItem<SessionInstance[]>("offline-sessions", [
        ...offlineSessions,
        { ...sessionData, id: id },
      ]);

      syncDispatch({ type: "SET_NOT_SYNCED" });

      // Upload through API
      const response = await uploadInstance({ ...sessionData, id });
      const body = await response.json();

      // Update context
      teaDispatch({
        type: "EDIT_ID",
        data: { instance: { ...sessionData, id }, newID: body.id },
      });

      // Delete offline entry
      for (const session of offlineSessions)
        if (session.id === id)
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
    <EditorContext.Provider value={handleSessionEdit}>
      {children}
    </EditorContext.Provider>
  );
}

export default EditSession;
