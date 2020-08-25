import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from 'react';
import localforage from "localforage";
import { APIRequest } from "../../services/auth-services";
import { genericAction, genericReducer } from "../../services/sync-services";
import { SubcategoryModel } from "../../services/models";

export const SubcategoriesState = createContext<SubcategoryModel[]>([]);
export const SubcategoriesDispatch = createContext(
  {} as Dispatch<genericAction>
);

type Props = {
  children: ReactChild;
};

/**
 * Subcategories state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SubcategoriesContext({
  children,
}: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf SubcategoriesContext
     */
    async function getSubcategories(): Promise<void> {
      try {
        // Get cached subcategories first
        const localSub = await localforage.getItem<SubcategoryModel[]>(
          "subcategories"
        );
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with subcategories from API
        const res = await APIRequest("/subcategory/", "GET");
        const body = await res?.json();
        dispatch({ type: "SET", data: body });
        await localforage.setItem<SubcategoryModel[]>("subcategories", body);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) getSubcategories();
  }, [state]);

  return (
    <SubcategoriesState.Provider value={state as SubcategoryModel[]}>
      <SubcategoriesDispatch.Provider value={dispatch}>
        {children}
      </SubcategoriesDispatch.Provider>
    </SubcategoriesState.Provider>
  );
}

export default SubcategoriesContext;
