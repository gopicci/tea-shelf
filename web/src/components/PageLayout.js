import {Box, Toolbar} from '@material-ui/core';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import SearchAppBar from './appbar/SearchAppBar';
import DrawerLayout from './drawer/DrawerLayout';
import GridLayout from './grid/GridLayout';
import FilterChips from './chips/FilterChips';

import FilterStateContainer from './containers/FilterStateContainer';


const useStyles = makeStyles((theme) => ({
  page: {
    display: 'flex',
  },
  center: {
    display: 'block ',
    paddingTop: theme.spacing(2),
  },
}));


export default function PageLayout() {
  const classes = useStyles();

  return (
    <>
      <SearchAppBar />
      <Box my={4} className={ classes.page }>
        <FilterStateContainer>
          <DrawerLayout />
          <Box my={4} className={ classes.center }>
            <FilterChips />
            <GridLayout />
          </Box>
        </FilterStateContainer>
      </Box>
    </>
  )
}