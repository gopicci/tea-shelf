import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import { getOfflineTeas, syncOffline } from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import { TeaModel } from "../../services/models";
import { genericReducer, genericAction } from "../../services/sync-services";

export const TeasState = createContext<TeaModel[]>([]);
export const TeaDispatch = createContext({} as Dispatch<genericAction>);

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
        await syncOffline();
      } catch (e) {
        console.error(e);
      }

      try {
        // Get offline teas (not yet uploaded)
        const offlineTeas = await getOfflineTeas();

        // Get cached teas if id not already on offline
        let localTeas = await localforage.getItem<TeaModel[]>("teas");
        if (!localTeas) localTeas = [];
        else
          localTeas = localTeas.filter(
            (lt) => !offlineTeas.some((ot) => ot.id === lt.id)
          );

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineTeas.concat(localTeas) });

        // Get online teas if id not already on offline
        const res = await APIRequest("/tea/", "GET");
        let onlineTeas = await res?.json();
        if (!onlineTeas) onlineTeas = [];
        else
          onlineTeas = onlineTeas.filter(
            (online: TeaModel) =>
              !offlineTeas.some((offline: TeaModel) => offline.id === online.id)
          );

        // Update the state
        dispatch({ type: "SET", data: offlineTeas.concat(onlineTeas) });

        // Update the cache
        await localforage.setItem<TeaModel[]>("teas", onlineTeas);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length) syncTeas();
  }, [state]);

  return (
    <TeasState.Provider value={state as TeaModel[]}>
      <TeaDispatch.Provider value={dispatch}>{children}</TeaDispatch.Provider>
    </TeasState.Provider>
  );
}

export default TeaContext;
