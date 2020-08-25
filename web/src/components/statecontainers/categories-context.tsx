import React, { createContext, ReactElement, useEffect, useState } from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/auth-services";
import { logout } from "../../services/auth-services";
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
 * functions, the state gets updated cache first and logs out user on error.
 *
 * @component
 * @subcategory State containers
 */
function CategoriesContext({ children }: Props): ReactElement {
  const [state, setState] = useState<CategoryModel[]>([]);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     * Logout on error.
     *
     * @memberOf CategoriesContext
     */
    async function getCategories(): Promise<void> {
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
