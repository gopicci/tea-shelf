import { Divider, Drawer, Toolbar, Typography } from '@material-ui/core';
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
      <div className={classes.drawerContainer}>
      <Toolbar/>
      <Typography variant='h5'>
        Add tea
        <Divider />
        Cellar
        <Divider />
        Archive
        <Divider />
        Sessions
        <Divider />
        Sessions
        <Divider />
      </Typography>

      </div>
    </Drawer>
  )
}