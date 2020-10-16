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
  uploadOffline,
  syncInstances,
} from "../../services/sync-services";
import { TeaInstance } from "../../services/models";

export const TeasState = createContext<TeaInstance[]>([]);
export const TeaDispatch = createContext({} as Dispatch<GenericAction>);

type Props = {
  children: ReactChild;
};

/**
 * Teas state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function TeaContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf TeaContext
     */
    async function syncTeas(): Promise<void> {
      try {
        // Try to upload offline tea entries
        await uploadOffline("tea");
      } catch (e) {
        console.error(e);
      }

      try {
        // Update teas state
        await syncInstances("tea", dispatch);
      } catch (e) {
        console.error(e);
      }
    }
    syncTeas();
  }, []);

  return (
    <TeasState.Provider value={state as TeaInstance[]}>
      <TeaDispatch.Provider value={dispatch}>{children}</TeaDispatch.Provider>
    </TeasState.Provider>
  );
}

export default TeaContext;
