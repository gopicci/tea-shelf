import {Box, Toolbar} from '@material-ui/core';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SearchAppBar from './appbar/SearchAppBar';
import DrawerLayout from './drawer/DrawerLayout';
import GridLayout from './grid/GridLayout';
import FilterLayout from './filters/FilterLayout';

import FilterStateContainer from './containers/FilterStateContainer';
import GridViewStateContainer from './containers/GridViewStateContainer';

const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.main,
  },
  center: {
    display: 'block',
    flexGrow: 1,
  },
}));


export default function PageLayout() {
  const classes = useStyles();

  return (
    <GridViewStateContainer>
      <SearchAppBar />
      <Toolbar />
      <Box className={ classes.page }>
        <FilterStateContainer>
          <DrawerLayout />
          <Box className={ classes.center }>
            <FilterLayout />
            <GridLayout />
          </Box>
        </FilterStateContainer>
      </Box>
    </GridViewStateContainer>
  )
}