import React, { createContext, useEffect, useState } from "react";
import localforage from "localforage";

import { APIRequest } from "../../services/AuthService";
import { logout } from "../../services/AuthService";

export const CategoriesState = createContext(null);

/**
 * Categories state provider. Categories are central to a lot of the app
 * functions, they get loaded cache first otherwise user gets logged out.
 */
export default function CategoriesContext(props) {
  const [state, setState] = useState(null);

  useEffect(() => {
    async function getCategories() {
      const localCategories = await localforage.getItem("categories");

      if (localCategories) setState(localCategories);
      else
        try {
          const res = await APIRequest("/category/", "GET");
          const body = await res.json();
          setState(body);
          await localforage.setItem("categories", body);
        } catch (e) {
          console.error(e);
          logout();
        }
    }
    getCategories();
  }, []);

  return (
    <CategoriesState.Provider value={state}>
      {props.children}
    </CategoriesState.Provider>
  );
}
