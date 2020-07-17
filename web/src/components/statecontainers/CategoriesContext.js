import React, {useContext, useEffect, useState} from 'react';
import {APIRequest} from '../../services/AuthService';

import localforage from 'localforage';

import {logout} from '../../services/AuthService';

export const CategoriesState = React.createContext(null)


export default function CategoriesContext(props) {

  const [state, setState] = useState(null);

  useEffect(() => {
    console.log('1')
    localforage.getItem('categories')
      .then(value => {
        if (value){
          setState(value);
          console.log('get local categories', value);
        } else {
          console.log('2')
          APIRequest('/category/', 'GET')
          .then(res => {
            if (res.ok)
              res.json().then(body => {
                setState(body);
                console.log('/category/', body);
                localforage.setItem('categories', body)
                  .then(cache => console.log('set local categories', cache))
              })
          }).catch((e) => {
              console.log(e, 'logging out');
              logout();
              })
      }
  })
  }, []);

  return (
    <CategoriesState.Provider value={state}>
      {props.children}
    </CategoriesState.Provider>
  )
}