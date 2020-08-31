import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useReducer,
} from "react";

/**
 * Sync reducer action type
 *
 * @memberOf SyncContext
 */
type Action = {
  /** Action type */
  type: "SET_SYNCED" | "SET_NOT_SYNCED";
};

function reducer(state: boolean, action: Action) {
  switch (action.type) {
    case "SET_SYNCED":
      return true;
    case "SET_NOT_SYNCED":
      return false;
    default:
      return false;
  }
}

const initialState = false;

export const SyncState = createContext(initialState);
export const SyncDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactChild;
};

/**
 * Offline data sync status state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SyncContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SyncDispatch.Provider value={dispatch}>
      <SyncState.Provider value={state}>{children}</SyncState.Provider>
    </SyncDispatch.Provider>
  );
}

export default SyncContext;
