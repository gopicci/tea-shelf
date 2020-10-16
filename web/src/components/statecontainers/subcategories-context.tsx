import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  GenericAction,
  genericReducer,
  syncInstances,
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
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf SubcategoriesContext
     */
    async function getSubcategories(): Promise<void> {
      try {
        await syncInstances("subcategory", dispatch);
        setSyncing(false);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length && !syncing) {
      setSyncing(true);
      getSubcategories();
    }
  }, [state, syncing]);

  return (
    <SubcategoriesState.Provider value={state as SubcategoryInstance[]}>
      <SubcategoriesDispatch.Provider value={dispatch}>
        {children}
      </SubcategoriesDispatch.Provider>
    </SubcategoriesState.Provider>
  );
}

export default SubcategoriesContext;
