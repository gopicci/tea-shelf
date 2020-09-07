import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useReducer,
} from "react";
import { Color } from "@material-ui/lab/Alert";

/**
 * Snackbar state type
 *
 * @memberOf SnackbarContext
 */
type State = {
  /** Snackbar open status */
  open: boolean;
  /** Message severity */
  severity: Color;
  /** Snackbar message */
  message: string;
};

/**
 * Snackbar reducer action type
 *
 * @memberOf SnackbarContext
 */
export type SnackbarAction =
  | {
      /** Available actions by severity */
      type: "ERROR" | "WARNING" | "INFO" | "SUCCESS";
      /** Message to be displayed on the snackbar */
      data: string;
    }
  | {
      /** Reset to initial state */
      type: "RESET";
    };

const initialState: State = {
  open: false,
  severity: "" as Color,
  message: "",
};

function reducer(state: State, action: SnackbarAction) {
  switch (action.type) {
    case "ERROR":
    case "WARNING":
    case "INFO":
    case "SUCCESS":
      return {
        open: true,
        severity: action.type.toLowerCase() as Color,
        message: action.data,
      };
    case "RESET":
      let newState = initialState;
      newState.severity = state.severity;
      return newState;
    default:
      return initialState;
  }
}

export const SnackbarState = createContext(initialState);
export const SnackbarDispatch = createContext({} as Dispatch<SnackbarAction>);

type Props = {
  children: ReactChild;
};

/**
 * Snackbar state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SnackbarContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SnackbarDispatch.Provider value={dispatch}>
      <SnackbarState.Provider value={state}>{children}</SnackbarState.Provider>
    </SnackbarDispatch.Provider>
  );
}

export default SnackbarContext;
