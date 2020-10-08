import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useContext,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import { genericReducer, GenericAction } from "../../services/sync-services";
import { parseHMSToSeconds } from "../../services/parsing-services";
import { SessionsState } from "./session-context";
import { Clock } from "../../services/models";

export const ClocksState = createContext<Clock[]>([]);
export const ClockDispatch = createContext({} as Dispatch<GenericAction>);

type Props = {
  children: ReactChild;
};

/**
 * Brewing clock state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function ClockContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(genericReducer, []);

  const sessions = useContext(SessionsState);

  useEffect(() => {
    /**
     * Updates the state cache first on state changes.
     *
     * @memberOf ClockContext
     */
    async function syncClocks(): Promise<void> {
      try {
        let clocks: Clock[] = [];

        // Get clocks from cache
        const cached = await localforage.getItem<Clock[]>("clocks");

        if (!cached) return;

        // Remove finished clocks
        for (const clock of cached) {
          const session = sessions.find((s) => s.id === clock.id);
          if (
            session &&
            session.brewing.initial &&
            session.brewing.increments
          ) {
            const start = new Date(session.last_brewed_on).getSeconds();
            const initial = parseHMSToSeconds(session.brewing.initial);
            const increments = parseHMSToSeconds(session.brewing.increments);
            const total = initial + increments * (session.current_infusion - 1);
            const finish = Date.now() + total * 1000;
            if (start < finish) clocks.push(clock);
          }
        }

        // Update the state
        dispatch({ type: "SET", data: clocks });

        // Update the cache
        await localforage.setItem<Clock[]>("clocks", clocks);
      } catch (e) {
        console.error(e);
      }
    }
    syncClocks();
  }, [sessions]);

  return (
    <ClocksState.Provider value={state as Clock[]}>
      <ClockDispatch.Provider value={dispatch}>
        {children}
      </ClockDispatch.Provider>
    </ClocksState.Provider>
  );
}

export default ClockContext;
