import React, {
  createContext,
  Dispatch,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import localforage from "localforage";
import { getOfflineTeas, syncOffline } from "../../services/sync-services";
import { APIRequest } from "../../services/AuthService";
import { TeaModel } from "../../services/models";

type Action =
  | { type: "CLEAR" }
  | { type: "SET"; data: TeaModel[] }
  | { type: "ADD"; data: TeaModel }
  | { type: "EDIT"; data: TeaModel }
  | { type: "DELETE"; data: TeaModel };

function reducer(state: TeaModel[], action: Action) {
  switch (action.type) {
    case "CLEAR":
      return [];
    case "SET":
      return action.data;
    case "ADD":
      return state?.concat(action.data);
    case "EDIT":
      return state?.map((item) =>
        item.id === action.data.id ? action.data : item
      );
    case "DELETE":
      if (state.length < 2) return [];
      let newState = [];
      for (const item of state)
        if (item.id !== action.data.id) newState.push(item);
      return newState;
    default:
      return [];
  }
}

export const TeasState = createContext<TeaModel[]>([]);
export const TeaDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactElement;
};

/**
 * Teas state and dispatch provider.
 */
function TeaContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    async function syncTeas() {
      try {
        // Try to upload offline tea entries
        await syncOffline();
      } catch (e) {
        console.error(e);
      }

      try {
        // Get offline teas (not yet uploaded)
        const offlineTeas = await getOfflineTeas();

        // Get cached teas if id not already on offline
        let localTeas = await localforage.getItem<TeaModel[]>("teas");
        if (!localTeas) localTeas = [];
        else
          localTeas = localTeas.filter(
            (lt) => !offlineTeas.some((ot) => ot.id === lt.id)
          );

        // Set initial state merging cached data
        dispatch({ type: "SET", data: offlineTeas.concat(localTeas) });

        // Get online teas if id not already on offline
        const res = await APIRequest("/tea/", "GET");
        let onlineTeas = await res?.json();
        if (!onlineTeas) onlineTeas = [];
        else
          onlineTeas = onlineTeas.filter(
            (online: TeaModel) =>
              !offlineTeas.some((offline: TeaModel) => offline.id === online.id)
          );

        // Update the state
        dispatch({ type: "SET", data: offlineTeas.concat(onlineTeas) });

        // Update the cache
        await localforage.setItem<TeaModel[]>("teas", onlineTeas);
      } catch (e) {
        console.error(e);
      }
    }
    if (!state) syncTeas();
  }, [state]);

  return (
    <TeasState.Provider value={state}>
      <TeaDispatch.Provider value={dispatch}>{children}</TeaDispatch.Provider>
    </TeasState.Provider>
  );
}

export default TeaContext;
