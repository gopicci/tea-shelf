import React, {
  createContext,
  useEffect,
  useReducer,
} from "react";

import localforage from "localforage";
import { getOfflineTeas } from '../../services/SyncService';
import { APIRequest } from "../../services/AuthService";
import { genericReducer } from '../../services/SyncService';


export const TeasState = createContext(null);
export const TeaDispatch = createContext(null);

export default function TeasContext(props) {
  /**
   * Defines overall tea entries context.
   *
   */

  const [state, dispatch] = useReducer(genericReducer, null);



  useEffect(() => {
    async function getTeas() {
      try {
        // Get offline teas (not yet uploaded)
        const offlineTeas = await getOfflineTeas();

        // Get cached teas
        let localTeas = await localforage.getItem("teas");

        if (!localTeas) localTeas = [];

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineTeas.concat(localTeas) });

        // Launch an API request
        const res = await APIRequest("/tea/", "GET");
        const body = await res.json();

        // Update the state
        dispatch({ type: "SET", data: offlineTeas.concat(body) });

        // Update the cache
        await localforage.setItem("teas", body);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) getTeas();
  }, [state]);

  return (
    <TeasState.Provider value={state}>
      <TeaDispatch.Provider value={dispatch}>
        {props.children}
      </TeaDispatch.Provider>
    </TeasState.Provider>
  );
}
