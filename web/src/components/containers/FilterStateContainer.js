import React, { useReducer } from 'react';

import { categories, subcategories, countries, regions, sorting } from '../../dev/DevData';

const categoriesFilter = categories.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {})

const subcategoriesFilter = subcategories.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {})


const countriesFilter = countries.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {})

const regionsFilter = regions.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {})


const sortingFilter = sorting.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {})

const initialState = {
    sorting: sortingFilter,
    active: 0,
    filters: {
      categories: categoriesFilter,
      subcategories: subcategoriesFilter,
      countries: countriesFilter,
      regions: regionsFilter,
    }
}

export const FilterState = React.createContext(initialState)
export const FilterDispatch = React.createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case "CHECK_FILTER":
      let activeUpdate = state.active;
      const checked = !state.filters[action.data.entry][action.data.item]
      if (checked){
        activeUpdate += 1;
      } else {
        activeUpdate -= 1;
      }
      const newFilterState = JSON.parse(JSON.stringify(state))
      newFilterState.active = activeUpdate
      newFilterState.filters[action.data.entry][action.data.item] = checked
      return newFilterState
    case "CHECK_SORT":
      const newSort = JSON.parse(JSON.stringify(state))
      newSort.sorting = {...initialState.sorting}
      newSort.sorting[action.data.item] = true;
      return newSort
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