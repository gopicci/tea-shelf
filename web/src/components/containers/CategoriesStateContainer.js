import React, {useContext, useEffect, useState} from 'react';
import {APIRequest} from '../../services/AuthService';

import localforage from 'localforage';

import {LogoutDispatch} from './LoggedInStateContainer';

export const CategoriesState = React.createContext(null)


export default function CategoriesStateContainer(props) {

  const [state, setState] = useState(null);

  const logout = useContext(LogoutDispatch);

  useEffect(() => {
    localforage.getItem('categories')
      .then(value => {
        if (value){
          setState(value);
          console.log('get local categories', value);
        } else {
          APIRequest('/category/', 'GET')
          .then(res => {
            if (res.ok)
              res.json().then(body => {
                setState(body);
                console.log('/category/', body);
                localforage.setItem('categories', body)
                  .then(cache => console.log('set local categories', cache))
              })
            else
              logout();
          });
        }
      })
      .catch((e) => console.log(e))

  }, []);

  return (
    <CategoriesState.Provider value={state}>
      {props.children}
    </CategoriesState.Provider>
  )
}