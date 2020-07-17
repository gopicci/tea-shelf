import React, {useContext, useState} from 'react';
import {Collapse, FormGroup, FormLabel, Link, List, ListItem, Typography,} from '@material-ui/core';

import {formListStyles} from '../../style/FormListStyles'

import FilterItem from './FilterItem';

import {FilterDispatch} from '../statecontainers/FilterContext'


export default function FilterList({ entry, list }) {
  const classes = formListStyles();

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
        data: { entry: entry, item: event }
      });
  };

  const [open, setOpen] = useState(false);

  const handleShowAllClick = () => {
    setOpen(!open);
  };

  return (
    <FormGroup>
      <FormLabel className={classes.formLabel}>
        <Typography  className={classes.entryName}>
          {entry === 'sorting' ? 'Sort by' : entry}:
        </Typography>
      </FormLabel>
      <List dense={true}>
        {
          Object.entries(list).slice(0,3).map(([item, checked]) => (
            <FilterItem key={item} name={item} checked={checked} handleChange={handleChange} />
          ))
        }
        {
          Object.entries(list).length > 3 &&
            !open &&
              <ListItem key='ShowAll' className={classes.listItem}>
                <Link className={classes.linkSmall} onClick={handleShowAllClick}>Show all</Link>
              </ListItem>
        }
        <Collapse in={open} timeout="auto">
            {
              Object.entries(list).slice(3).map(([item, checked]) => (
                <FilterItem key={item} name={item} checked={checked} handleChange={handleChange} />
              ))
            }
        </Collapse>
      </List>
    </FormGroup>
  );
}
