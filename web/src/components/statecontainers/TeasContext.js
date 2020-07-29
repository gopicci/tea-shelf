import React, { createContext, useEffect, useReducer } from "react";
import localforage from "localforage";
import { getOfflineTeas, syncOffline } from "../../services/SyncService";
import { APIRequest } from "../../services/AuthService";
import { genericReducer } from "../../services/SyncService";

export const TeasState = createContext(null);
export const TeaDispatch = createContext(null);

export default function TeasContext(props) {
  /**
   * Teas state and dispatch provider.
   */

  const [state, dispatch] = useReducer(genericReducer, null);

  useEffect(() => {
    async function syncTeas() {
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
        let localTeas = await localforage.getItem("teas");
        if (!localTeas) localTeas = [];
        else
          localTeas = localTeas.filter(
            (lt) => !offlineTeas.some((ot) => ot.id === lt.id)
          );

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineTeas.concat(localTeas) });

        // Get online teas if id not already on offline
        const res = await APIRequest("/tea/", "GET");
        let onlineTeas = await res.json();
        if (!onlineTeas) onlineTeas = [];
        else
          onlineTeas = onlineTeas.filter(
            (nt) => !offlineTeas.some((ot) => ot.id === nt.id)
          );

        // Update the state
        dispatch({ type: "SET", data: offlineTeas.concat(onlineTeas) });

        // Update the cache
        await localforage.setItem("teas", onlineTeas);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) syncTeas();
  }, [state]);

  return (
    <TeasState.Provider value={state}>
      <TeaDispatch.Provider value={dispatch}>
        {props.children}
      </TeaDispatch.Provider>
    </TeasState.Provider>
  );
}
