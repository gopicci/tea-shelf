import React, {useContext, useState} from 'react';
import {Collapse, FormGroup, FormLabel, Link, List, ListItem, Typography,} from '@material-ui/core';

import {formListStyles} from '../../style/FormListStyles'

import FilterItem from './FilterItem';

import {FilterDispatch} from '../statecontainers/FilterContext'


export default function FilterList({ entry, list }) {
  const formListClasses = formListStyles();

  const dispatch = useContext(FilterDispatch)

  const handleChange = (event) => {
    if (entry === 'sorting')
      dispatch({
        type: "CHECK_SORT",
        data: { item: event.target.name }
      })
    else
      dispatch({
        type: "CHECK_FILTER",
        data: { entry: entry, item: event.target.name }
      });
  };

  const [open, setOpen] = useState(false);

  const handleShowAllClick = () => {
    setOpen(!open);
  };

  return (
    <FormGroup>
      <FormLabel className={formListClasses.formLabel}>
        <Typography  className={formListClasses.formLabelText}>
          {entry === 'sorting' ? 'Sort by' : entry}:
        </Typography>
      </FormLabel>
      <List className={formListClasses.list}>
        {list &&
          Object.entries(list).slice(0,3).map(([item, checked]) => (
            <FilterItem key={item} name={item} checked={checked} handleChange={handleChange} />
          ))
        }
        {list &&
          Object.entries(list).length > 3 &&
            !open &&
              <ListItem key='ShowAll' className={formListClasses.listItem}>
                <Link className={formListClasses.linkSmall} onClick={handleShowAllClick}>Show all</Link>
              </ListItem>
        }
        <Collapse in={open} timeout="auto">
            {list &&
              Object.entries(list).slice(3).map(([item, checked]) => (
                <FilterItem key={item} name={item} checked={checked} handleChange={handleChange} />
              ))
            }
        </Collapse>
      </List>
    </FormGroup>
  );
}
