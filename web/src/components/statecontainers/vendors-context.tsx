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
  genericReducer,
} from "../../services/sync-services";
import { SubcategoryInstance, VendorInstance } from "../../services/models";

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
        // Get cached vendors first
        const localSub = await localforage.getItem<VendorInstance[]>("vendors");
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with vendors from API
        const res = await APIRequest("/vendor/", "GET");
        const body = await res?.json();

        let vendors: SubcategoryInstance[] = [];

        for (const vendor of body) {
          if (vendor.offline_id) vendors.push(vendor);
          else
            vendors.push({
              ...vendor,
              offline_id: await generateUniqueId(vendors),
            });
        }

        dispatch({ type: "SET", data: vendors });
        await localforage.setItem<VendorInstance[]>("vendors", vendors);
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
