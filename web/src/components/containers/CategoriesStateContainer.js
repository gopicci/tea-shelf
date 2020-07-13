import React, {useEffect, useState} from 'react';
import {APIRequest} from '../../services/AuthService';


export const CategoriesState = React.createContext(null)


export default function CategoriesStateContainer(props) {

  const [state, setState] = useState(null);

  useEffect(() => {
    APIRequest('/category/', 'GET')
      .then(res => {
        setState(res);
        console.log('categories:', res);
      })
  }, [])

  return (
    <CategoriesState.Provider value={state}>
      {props.children}
    </CategoriesState.Provider>

  )

}