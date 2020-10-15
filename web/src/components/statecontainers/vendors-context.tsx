import React, {
  Dispatch,
  createContext,
  useEffect,
  useReducer,
  ReactElement,
  ReactChild,
} from "react";
import localforage from "localforage";
import { APIRequest } from "../../services/auth-services";
import {
  generateUniqueId,
  GenericAction,
  genericReducer, syncInstances,
} from '../../services/sync-services';
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

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf VendorsContext
     */
    async function getVendors(): Promise<void> {
      try {
        await syncInstances("vendor", dispatch);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length) getVendors();
  }, [state]);

  return (
    <VendorsState.Provider value={state as VendorInstance[]}>
      <VendorsDispatch.Provider value={dispatch}>
        {children}
      </VendorsDispatch.Provider>
    </VendorsState.Provider>
  );
}

export default VendorsContext;
