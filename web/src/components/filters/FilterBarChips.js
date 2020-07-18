import React, {useContext} from 'react';
import { Chip } from '@material-ui/core';
import {FilterDispatch, FilterContext} from '../statecontainers/FilterContext';


export default function FilterBarChips() {
  const state = useContext(FilterContext)
  const dispatch = useContext(FilterDispatch)

  const handleDelete = (event, entry, item) => {
    dispatch({
      type: "CHECK_FILTER",
      data: { entry: entry, item: item }
    });
  };

  return (
    <>
      {
        Object.entries(state.filters).map(([entry, list]) => (
          list &&
          Object.entries(list).map(([item, checked]) => (
            item &&
            checked &&
             <Chip
                key={item}
                name={item}
                label={item}
                onClick={e => { e.stopPropagation() }}
                onDelete={e => handleDelete(e, entry, item)}
                size='small'
              />
          ))
        ))
      }
    </>
  );
}