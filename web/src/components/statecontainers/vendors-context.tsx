import React, {
  Dispatch,
  createContext,
  useEffect,
  useReducer,
  ReactElement,
  ReactChild, useState,
} from 'react';
import {
  GenericAction,
  genericReducer,
  syncInstances,
} from "../../services/sync-services";
import { VendorInstance } from "../../services/models";

export const VendorsState = createContext<VendorInstance[]>([]);
export const VendorsDispatch = createContext({} as Dispatch<GenericAction>);

type Props = {
  children: ReactChild;
};

/**
 * Vendors state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function VendorsContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf VendorsContext
     */
    async function getVendors(): Promise<void> {
      try {
        await syncInstances("vendor", dispatch);
        setSyncing(false);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length && !syncing) {
      setSyncing(true);
      getVendors();
    }
  }, [state, syncing]);

  return (
    <VendorsState.Provider value={state as VendorInstance[]}>
      <VendorsDispatch.Provider value={dispatch}>
        {children}
      </VendorsDispatch.Provider>
    </VendorsState.Provider>
  );
}

export default VendorsContext;
