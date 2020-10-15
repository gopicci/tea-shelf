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
  uploadOfflineTeas,
  generateUniqueId,
} from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
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
        await uploadOfflineTeas();
      } catch (e) {
        console.error(e);
      }

      try {
        // Get offline teas (not yet uploaded)
        let offlineTeas = await localforage.getItem<TeaInstance[]>(
          "offline-teas"
        );
        if (!offlineTeas) offlineTeas = [];

        // Get cached teas if ID not already on offline
        let localTeas = await localforage.getItem<TeaInstance[]>("teas");
        if (!localTeas) localTeas = [];
        else
          localTeas = localTeas.filter(
            (lt) => !offlineTeas.some((ot) => ot.offline_id === lt.offline_id)
          );

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineTeas.concat(localTeas) });

        // Get online teas if API ID not already on offline
        const res = await APIRequest("/tea/", "GET");
        let onlineTeas = await res?.json();
        if (!onlineTeas) onlineTeas = [];
        else
          onlineTeas = onlineTeas.filter(
            (online: TeaInstance) =>
              !offlineTeas.some(
                (offline: TeaInstance) => offline.id === online.id
              )
          );

        let apiTeas: TeaInstance[] = [];

        for (let tea of offlineTeas.concat(onlineTeas)) {
          if (!tea.offline_id)
            apiTeas.push({ ...tea, offline_id: await generateUniqueId(offlineTeas.concat(onlineTeas)) });
        }

        // Update the state
        dispatch({ type: "SET", data: offlineTeas.concat(apiTeas) });

        // Update the cache
        await localforage.setItem<TeaInstance[]>("teas", apiTeas);
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
