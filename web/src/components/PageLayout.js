import React, { useState, lazy } from 'react';
import { Backdrop, Box, Fab, Toolbar } from '@material-ui/core';
import { CameraAlt } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import SearchAppBar from './appbar/SearchAppBar';
import DrawerLayout from './drawer/DrawerLayout';
import GridLayout from './grid/GridLayout';
import FilterLayout from './filters/FilterLayout';

import FilterState from './statecontainers/FilterContext';

const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  mainBox: {
    display: 'block',
    flexGrow: 1,
  },
  addButton: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    position: 'fixed',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
}));


export default function PageLayout({setRoute}) {
  const classes = useStyles();

  const handleCreate = () => setRoute('CREATE');

  return (
    <>
      <SearchAppBar />
      <Toolbar />
      <Box className={classes.page}>
        <FilterState>
          <DrawerLayout />
          <Box className={classes.mainBox}>
            <FilterLayout />
            <GridLayout />
          </Box>
        </FilterState>
        <Fab className={classes.addButton} onClick={handleCreate}><CameraAlt /></Fab>
      </Box>
    </>
  );
};