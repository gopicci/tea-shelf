import React, { createContext, useReducer } from "react";

const initialState = { open: false, severity: null, message: null };

export const SnackbarState = createContext(initialState);
export const SnackbarDispatch = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "ERROR":
      return { open: true, severity: "error", message: action.data };
    case "RESET":
      return initialState;
    default:
      return action;
  }
};

export default function SnackbarContext(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SnackbarDispatch.Provider value={dispatch}>
      <SnackbarState.Provider value={state}>
        {props.children}
      </SnackbarState.Provider>
    </SnackbarDispatch.Provider>
  );
}
