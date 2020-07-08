import React, { useReducer, useState } from 'react';

const categoriesInput = ['White', 'Yellow', 'Black', 'Oolong', 'Post fermented', 'Herbal', 'Other']
  .reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {})

const subcategoriesInput = ['Da Hong Pao', 'Jin Jun Mei', 'Dan Cong', 'Dien Hong', 'Darjeeling']
  .reduce((obj, item) => {
    obj[item] = false;
    return obj;
  }, {})

const originInput = [
  {
    china: ['Yunnan', 'Bulang', 'Yiwu Mountain']
  },
  {
    india: ['Assam', 'Darjeeling']
  },
  {
    taiwan: []
  },
]

const initialState = {
  Categories: categoriesInput,
  Subcategories: subcategoriesInput,
}


export const FilterDispatch = React.createContext(null);
export const FilterState = React.createContext(initialState)


console.log(initialState)

const reducer = (state, action) => {
  switch (action.type) {
    case "CHECK":
      return {
      ...state,
      [action.data.entry]: {
        ...state[action.data.entry],
        [action.data.item]: !state[action.data.entry][action.data.item]
      }
    }
    case "CLEAR":
      return {
        ...state,
        [action.data.entry]: initialState[action.data.entry]
      }
  }
  return action
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