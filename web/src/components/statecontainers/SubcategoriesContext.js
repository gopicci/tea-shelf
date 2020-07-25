import React, { createContext, useEffect, useReducer } from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/AuthService";
import { genericReducer } from "../../services/SyncService";

export const SubcategoriesState = createContext(null);
export const SubcategoriesDispatch = createContext(null);

export default function SubcategoriesContext(props) {
  /**
   * Subcategories state and dispatch provider.
   */

  const [state, dispatch] = useReducer(genericReducer, null);

  useEffect(() => {
    async function getSubcategories() {
      try {
        // Get cached subcategories first
        const localSub = await localforage.getItem("subcategories");
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with subcategories from API
        const res = await APIRequest("/subcategory/", "GET");
        const body = await res.json();
        dispatch({ type: "SET", data: body });
        await localforage.setItem("subcategories", body);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) getSubcategories();
  }, [state]);

  return (
    <SubcategoriesState.Provider value={state}>
      <SubcategoriesDispatch.Provider value={dispatch}>
        {props.children}
      </SubcategoriesDispatch.Provider>
    </SubcategoriesState.Provider>
  );
}
