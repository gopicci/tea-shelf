import React, { useReducer } from 'react';


const initialState = true

export const GridViewState = React.createContext(initialState)
export const GridViewDispatch = React.createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "SWITCH_VIEW":
      return !state
    default:
      return action
  }
}

export default function GridViewStateContainer(props) {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GridViewDispatch.Provider value={dispatch}>
      <GridViewState.Provider value={state}>
        {props.children}
      </GridViewState.Provider>
    </GridViewDispatch.Provider>

  )

}