import React, { useContext, useState } from 'react';
import {Collapse, FormGroup, FormLabel, Link, List, ListItem, Typography,} from '@material-ui/core';
import {fade, makeStyles} from '@material-ui/core/styles';

import FilterItem from './FilterItem';

import {FilterDispatch, FilterState} from '../containers/FilterStateContainer'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  formLabel: {
    display: 'flex',
    padding: theme.spacing(1),
    background: fade(theme.palette.primary.light, 0.15),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  linkSmall: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontSize: 10,
    fontWeight: 'bold',
    color: `${theme.palette.primary.main}`,
    cursor: 'pointer',
  },
  entryName: {
    flexGrow: 1,
  }
}));

export default function FilterList({ entry, list }) {
  const classes = useStyles();

  const dispatch = useContext(FilterDispatch)

  const handleChange = (event) => {
    dispatch({
      type: "CHECK",
      data: { entry: entry, item: event.target.name }
    });
  };

  const [open, setOpen] = useState(false);

  const handleShowAllClick = () => {
    setOpen(!open);
  };

  return (
        <FormGroup className={classes.root}>
          <FormLabel className={classes.formLabel}>
            <Typography  className={classes.entryName}>{entry}:</Typography>
          </FormLabel>
          <List dense={true}>
            {
              Object.entries(list).slice(0,3).map(([item, checked]) => (
                <FilterItem key={item} name={item} checked={checked} handleChange={handleChange} />
              ))
            }
            {
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
