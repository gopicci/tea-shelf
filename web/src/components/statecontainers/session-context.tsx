import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  genericReducer,
  GenericAction,
  uploadOfflineSessions, syncInstances,
} from '../../services/sync-services';
import { ClockDispatch } from "./clock-context";
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

  const clockDispatch = useContext(ClockDispatch);

  useEffect(() => {
    async function syncSessions() {
      try {
        // Try to upload offline brewing session entries
        await uploadOfflineSessions();
      } catch (e) {
        console.error(e);
      }

      try {
        // Update brewing sessions state
        await syncInstances("session", dispatch);
      } catch (e) {
        console.error(e);
      }
    }
    syncSessions();
  }, [clockDispatch]);

  return (
    <SessionsState.Provider value={state as SessionInstance[]}>
      <SessionDispatch.Provider value={dispatch}>
        {children}
      </SessionDispatch.Provider>
    </SessionsState.Provider>
  );
}

export default SessionContext;
