import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import { genericReducer, GenericAction } from "../../services/sync-services";
import { Clock } from "../../services/models";

export const ClocksState = createContext<Clock[]>([]);
export const ClockDispatch = createContext({} as Dispatch<GenericAction>);

type Props = {
  children: ReactChild;
};

/**
 * Brewing clock state and dispatch provider. Clocks are saved
 * only on local cache.
 *
 * @component
 * @subcategory State containers
 */
function ClockContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);

  useEffect(() => {
    /**
     * Updates the state from cache.
     *
     * @memberOf ClockContext
     */
    async function syncClocks(): Promise<void> {
      try {
        let clocks = await localforage.getItem<Clock[]>("clocks");
        if (!clocks) clocks = [];

        dispatch({ type: "SET", data: clocks });

        await localforage.setItem<Clock[]>("clocks", clocks);
      } catch (e) {
        console.error(e);
      }
    }
    syncClocks();
  }, []);

  return (
    <ClocksState.Provider value={state as Clock[]}>
      <ClockDispatch.Provider value={dispatch}>
        {children}
      </ClockDispatch.Provider>
    </ClocksState.Provider>
  );
}

export default ClockContext;
