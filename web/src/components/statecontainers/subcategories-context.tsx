import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/auth-services";
import {
  generateUniqueId,
  GenericAction,
  genericReducer,
} from "../../services/sync-services";
import { SubcategoryInstance } from "../../services/models";

export const SubcategoriesState = createContext<SubcategoryInstance[]>([]);
export const SubcategoriesDispatch = createContext(
  {} as Dispatch<GenericAction>
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
function SubcategoriesContext({ children }: Props): ReactElement {
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
        const localSub = await localforage.getItem<SubcategoryInstance[]>(
          "subcategories"
        );
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with subcategories from API
        const res = await APIRequest("/subcategory/", "GET");
        const body = await res?.json();

        // Add offline ID to new categories
        let subcategories: SubcategoryInstance[] = [];
        for (const sub of body) {
          subcategories.push({
            ...sub,
            offline_id: await generateUniqueId(subcategories),
          });
        }

        // Update state and cache
        dispatch({ type: "SET", data: subcategories });
        await localforage.setItem<SubcategoryInstance[]>(
          "subcategories",
          subcategories
        );
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length) getSubcategories();
  }, [state]);

  return (
    <SubcategoriesState.Provider value={state as SubcategoryInstance[]}>
      <SubcategoriesDispatch.Provider value={dispatch}>
        {children}
      </SubcategoriesDispatch.Provider>
    </SubcategoriesState.Provider>
  );
}

export default SubcategoriesContext;
