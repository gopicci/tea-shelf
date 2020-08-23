import React, { createContext, ReactElement, useEffect, useState } from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/AuthService";
import { logout } from "../../services/AuthService";
import { CategoryModel } from "../../services/models";

export const CategoriesState = createContext<CategoryModel[]>([]);

/**
 * CategoriesContext props.
 *
 * @memberOf CategoriesContext
 */
type Props = {
  /** Children components */
  children: ReactElement;
};

/**
 * Categories state provider. Categories are central to a lot of the app
 * functions, they get loaded cache first otherwise user gets logged out.
 *
 * @component
 */
function CategoriesContext({ children }: Props): ReactElement {
  const [state, setState] = useState<CategoryModel[]>([]);

  useEffect(() => {
    async function getCategories() {
      const localCategories = await localforage.getItem<CategoryModel[]>(
        "categories"
      );

      if (localCategories) setState(localCategories);
      else
        try {
          const res = await APIRequest("/category/", "GET");
          const body = await res?.json();
          setState(body);
          await localforage.setItem<CategoryModel[]>("categories", body);
        } catch (e) {
          console.error(e);
          logout();
        }
    }
    getCategories();
  }, []);

  return (
    <CategoriesState.Provider value={state}>
      {children}
    </CategoriesState.Provider>
  );
}

export default CategoriesContext;
