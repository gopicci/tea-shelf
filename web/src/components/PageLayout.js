import React, { useState, lazy } from 'react';
import { Backdrop, Box, Fab, Toolbar } from '@material-ui/core';
import { CameraAlt } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import SearchAppBar from './appbar/SearchAppBar';
import DrawerLayout from './drawer/DrawerLayout';
import GridLayout from './grid/GridLayout';
import FilterLayout from './filters/FilterLayout';

import FilterStateContainer from './containers/FilterStateContainer';
import GridViewStateContainer from './containers/GridViewStateContainer';

import CreateLayout from './create/CreateLayout';


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
  addButton: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    position: 'absolute',
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: '#fff',
  },
}));


export default function PageLayout() {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  }

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
        <Fab className={ classes.addButton } onClick={handleOpen}><CameraAlt /></Fab>
        { open ? <CreateLayout open={open} handleClose={handleClose} /> : ''}
      </Box>
    </GridViewStateContainer>
  )
}