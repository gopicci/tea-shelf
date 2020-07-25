import React, { createContext, useReducer } from "react";

const initialState = true;

export const GridViewState = createContext(initialState);
export const GridViewDispatch = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "SWITCH_VIEW":
      return !state;
    default:
      return action;
  }
};

export default function GridViewContext(props) {
  /**
   * Grid view switch status state and dispatch provider.
   */

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GridViewDispatch.Provider value={dispatch}>
      <GridViewState.Provider value={state}>
        {props.children}
      </GridViewState.Provider>
    </GridViewDispatch.Provider>
  );
}
