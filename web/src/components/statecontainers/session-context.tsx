import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import {
  genericReducer,
  GenericAction,
  uploadOffline, syncInstances,
} from '../../services/sync-services';
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
     * On mount tries to upload offline brewing session entries
     * and sync brewing sessions state.
     *
     * @memberOf TeaContext
     */
    async function syncSessions() {
      try {
        await uploadOffline("session");
      } catch (e) {
        console.error(e);
      }

      try {
        await syncInstances("session", dispatch);
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
