import React, { useReducer } from 'react';


export const LoggedInState = React.createContext(window.localStorage.getItem('user.auth') !== null)
export const LogoutDispatch = React.createContext(null);

const reducer = () => {
    window.localStorage.removeItem('user.auth');
    return false
}

export default function LoggedInStateContainer(props) {

  const [state, dispatch] = useReducer(reducer, window.localStorage.getItem('user.auth') !== null);

  return (
    <LogoutDispatch.Provider value={dispatch}>
      <LoggedInState.Provider value={state}>
        {props.children}
      </LoggedInState.Provider>
    </LogoutDispatch.Provider>

  )

}