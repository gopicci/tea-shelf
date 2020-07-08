import { Button, Divider, Drawer, Toolbar } from '@material-ui/core';
import FilterList from './FilterList';
import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { FilterState } from '../containers/FilterStateContainer';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    flexShrink: 0,
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function DrawerLayout() {
  const classes = useStyles();

  const state = useContext(FilterState)

  return (
    <Drawer
      className={classes.root}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar/>
      <Button variant="contained" disableElevation>Disable filters</Button>
      <Divider />
      <div className={classes.drawerContainer}>
        {
          Object.entries(state).map(([entry, list]) => (
          <FilterList entry={entry} list={list}/>
          ))
        }
      </div>
    </Drawer>
  )
}