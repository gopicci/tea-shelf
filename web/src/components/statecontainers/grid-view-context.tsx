import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useReducer,
} from "react";

/**
 * Grid view switch reducer action type
 *
 * @memberOf GridViewContext
 */
type Action = {
  /** Action type */
  type: "SWITCH_VIEW";
};

function reducer(state: boolean, action: Action) {
  switch (action.type) {
    case "SWITCH_VIEW":
      return !state;
    default:
      return !state;
  }
}

const initialState = true;

export const GridViewState = createContext(initialState);
export const GridViewDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactChild;
};

/**
 * Grid view switch status state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function GridViewContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GridViewDispatch.Provider value={dispatch}>
      <GridViewState.Provider value={state}>{children}</GridViewState.Provider>
    </GridViewDispatch.Provider>
  );
}

export default GridViewContext;
