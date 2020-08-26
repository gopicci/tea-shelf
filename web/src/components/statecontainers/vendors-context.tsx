import React, {
  Dispatch,
  createContext,
  useEffect,
  useReducer,
  ReactElement,
  ReactChild
} from 'react';
import localforage from "localforage";
import { APIRequest } from "../../services/auth-services";
import { genericAction, genericReducer } from "../../services/sync-services";
import { VendorModel } from "../../services/models";

export const VendorsState = createContext<VendorModel[]>([]);
export const VendorsDispatch = createContext({} as Dispatch<genericAction>);

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
        const localSub = await localforage.getItem<VendorModel[]>("vendors");
        if (localSub) dispatch({ type: "SET", data: localSub });

        // Update with vendors from API
        const res = await APIRequest("/vendor/", "GET");
        const body = await res?.json();
        dispatch({ type: "SET", data: body });
        await localforage.setItem<VendorModel[]>("vendors", body);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state.length) getVendors();
  }, [state]);

  return (
    <VendorsState.Provider value={state as VendorModel[]}>
      <VendorsDispatch.Provider value={dispatch}>
        {children}
      </VendorsDispatch.Provider>
    </VendorsState.Provider>
  );
}

export default VendorsContext;
