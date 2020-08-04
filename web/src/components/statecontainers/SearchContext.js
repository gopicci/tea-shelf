import React, { createContext, useReducer } from "react";

const initialState = "";

export const SearchState = createContext(initialState);
export const SearchDispatch = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return action.data;
    case "CLEAR":
      return initialState
    default:
      return action;
  }
};

export default function SearchContext(props) {
  /**
   * Search bar status state and dispatch provider.
   */

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SearchDispatch.Provider value={dispatch}>
      <SearchState.Provider value={state}>
        {props.children}
      </SearchState.Provider>
    </SearchDispatch.Provider>
  );
}