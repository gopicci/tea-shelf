import React, { useReducer } from 'react';

import { categories, subcategories, origins, sorting } from '../../dev/DevData';

const categoriesFilter = categories.reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {})

const subcategoriesFilter = subcategories.reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {})

const sortingFilter = sorting.reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {})

const initialState = {
    active: 0,
    Categories: categoriesFilter,
    Subcategories: subcategoriesFilter,

}

export const FilterState = React.createContext(initialState)
export const FilterDispatch = React.createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "CHECK":
      let activeUpdate = state.active;
      const checked = !state[action.data.entry][action.data.item]
      if (checked){
        activeUpdate += 1;
      } else {
        activeUpdate -= 1;
      }
      const newState = JSON.parse(JSON.stringify(state))
      newState.active = activeUpdate
      newState[action.data.entry][action.data.item] = checked
      return newState
    case "RESET":
      return initialState
    default:
      return action
  }
}

export default function FilterStateContainer(props) {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FilterDispatch.Provider value={dispatch}>
      <FilterState.Provider value={state}>
      {props.children}
      </FilterState.Provider>
    </FilterDispatch.Provider>

  )

}