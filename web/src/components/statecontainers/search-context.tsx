import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useReducer,
} from "react";

const initialState = "";

/**
 * Search reducer action type
 *
 * @memberOf SearchContext
 */
type Action = {
  /** Action type */
  type: "SET";
  /** Search input content */
  data: string;
} | {
  /** Action type */
  type: "CLEAR";
};

const reducer = (state: string, action: Action) => {
  switch (action.type) {
    case "SET":
      return action.data;
    case "CLEAR":
      return initialState;
    default:
      return initialState;
  }
};

export const SearchState = createContext(initialState);
export const SearchDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactChild;
};

/**
 * Search bar status state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SearchContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SearchDispatch.Provider value={dispatch}>
      <SearchState.Provider value={state}>{children}</SearchState.Provider>
    </SearchDispatch.Provider>
  );
}

export default SearchContext;
