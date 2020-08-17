import React, { createContext, useEffect, useReducer } from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/AuthService";
import { genericReducer } from "../../services/SyncService";

export const VendorsState = createContext(null);
export const VendorsDispatch = createContext(null);

/**
 * Vendors state and dispatch provider.
 */
export default function VendorsContext(props) {
  const [state, dispatch] = useReducer(genericReducer, null);

  useEffect(() => {
    async function getVendors() {
      try {
        // Get cached vendors first
        const localSub = await localforage.getItem("vendors");
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with vendors from API
        const res = await APIRequest("/vendor/", "GET");
        const body = await res.json();
        dispatch({ type: "SET", data: body });
        await localforage.setItem("vendors", body);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) getVendors();
  }, [state]);

  return (
    <VendorsState.Provider value={state}>
      <VendorsDispatch.Provider value={dispatch}>
        {props.children}
      </VendorsDispatch.Provider>
    </VendorsState.Provider>
  );
}
