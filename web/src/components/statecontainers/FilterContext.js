import React, {useContext, useReducer, useEffect, useState} from 'react';
import {getSubcategoryName} from '../../services/ParsingService';

import { countries, regions, sorting } from '../../dev/DevData';

import {CategoriesState} from './CategoriesContext';
import {SubcategoriesState} from './SubcategoriesContext';


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


export const FilterState = React.createContext(null)
export const FilterDispatch = React.createContext(null);

export default function FilterContext(props) {

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);

  const [initialState, setInitialState] = useState({
    sorting: {...sortingFilter, 'latest (default)': true },
    active: 0,
    filters: {
      categories: null,
      subcategories: null,
      countries: countriesFilter,
      regions: regionsFilter,
    }
  });

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
        newSort.sorting['latest (default)'] = false;
        newSort.sorting[action.data.item] = true;
        return newSort
      case "CLEAR":
        return {
          ...initialState,
          sorting: state.sorting,
        }
      case "RESET":
        return initialState
      default:
        return action
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (categories)
      setInitialState({
        ...initialState,
        filters: {
          ...initialState.filters,
          categories: categories.reduce((obj, item) => {
            obj[item.name.toLowerCase()] = false;
            return obj;
          }, {})
        }
      });
  }, [categories])

  useEffect(() => {
    if (subcategories)
      setInitialState({
        ...initialState,
        filters: {
          ...initialState.filters,
          subcategories: subcategories.reduce((obj, item) => {
            obj[getSubcategoryName(item).toLowerCase()] = false;
            return obj;
          }, {})
        }
      });
  }, [subcategories])


  useEffect(() => {
    dispatch({
      type: "CLEAR"
    });
  }, [initialState])

  return (
    <FilterDispatch.Provider value={dispatch}>
      <FilterState.Provider value={state}>
        {props.children}
      </FilterState.Provider>
    </FilterDispatch.Provider>

  )

}