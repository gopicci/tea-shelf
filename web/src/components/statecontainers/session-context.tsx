import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import {
  genericReducer,
  GenericAction,
  uploadOfflineSessions,
} from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import { SessionInstance } from "../../services/models";

export const SessionsState = createContext<SessionInstance[]>([]);
export const SessionDispatch = createContext({} as Dispatch<GenericAction>);

type Props = {
  children: ReactChild;
};

/**
 * Brewing session state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SessionContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf SessionContext
     */
    async function syncSessions(): Promise<void> {
      try {
        // Try to upload offline brewing session entries
        await uploadOfflineSessions();
      } catch (e) {
        console.error(e);
      }

      try {
        // Get offline sessions (not yet uploaded)
        let offlineSessions = await localforage.getItem<SessionInstance[]>(
          "offline-sessions"
        );
        if (!offlineSessions) offlineSessions = [];

        // Get cached sessions if id not already on offline
        let localSessions = await localforage.getItem<SessionInstance[]>(
          "sessions"
        );
        if (!localSessions) localSessions = [];
        else
          localSessions = localSessions.filter(
            (ls) => !offlineSessions.some((os) => os.id === ls.id)
          );

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineSessions.concat(localSessions) });

        // Get online sessions if id not already on offline
        const res = await APIRequest("/brewing_session/", "GET");
        let onlineSessions = await res?.json();
        if (!onlineSessions) onlineSessions = [];
        else
          onlineSessions = onlineSessions.filter(
            (online: SessionInstance) =>
              !offlineSessions.some(
                (offline: SessionInstance) => offline.id === online.id
              )
          );

        // Update the state
        dispatch({ type: "SET", data: offlineSessions.concat(onlineSessions) });

        // Update the cache
        await localforage.setItem<SessionInstance[]>(
          "sessions",
          onlineSessions
        );
      } catch (e) {
        console.error(e);
      }
    }
    syncSessions();
  }, []);

  return (
    <SessionsState.Provider value={state as SessionInstance[]}>
      <SessionDispatch.Provider value={dispatch}>
        {children}
      </SessionDispatch.Provider>
    </SessionsState.Provider>
  );
}

export default SessionContext;
