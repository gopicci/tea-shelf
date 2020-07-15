import React, {useContext, useEffect, useState} from 'react';
import {APIRequest} from '../../services/AuthService';

import localforage from 'localforage';

export const SubcategoriesState = React.createContext(null)


export default function SubcategoriesStateContainer(props) {

  const [state, setState] = useState(null);

  useEffect(() => {
    localforage.getItem('subcategories')
    .then(value => {
      if (value){
        setState(value);
        console.log('get local subcategories', value);
      }})
    .catch((e) => console.log(e));

    APIRequest('/subcategory/', 'GET')
    .then(res => {
      if (res) {
        setState(res);
        console.log('/subcategory/', res);
        localforage.setItem('subcategories', res)
          .then(res => console.log('set local subcategories', res))
      }
    })
    .catch((e) => console.log(e));

  }, []);

  return (
    <SubcategoriesState.Provider value={state}>
      {props.children}
    </SubcategoriesState.Provider>
  )
}