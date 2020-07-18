import React, {useState} from 'react';
import {Box, Button, Paper, Slide, Typography, useScrollTrigger} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

import FilterBarChips from './FilterBarChips';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
    position: 'fixed',
    top: '50px',
    zIndex: 2,
    width: '100vw',
    borderRadius: 0,
    paddingTop: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(0.5),
    },
  }
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}


export default function FilterBar({setRoute}) {
  const classes = useStyles();

  const handleButtonClick = () => setRoute('FILTER');

  return (
    <>
      <HideOnScroll>
        <Paper className={classes.root}>
            <Button size='small' color='primary' disableElevation onClick={handleButtonClick}>Sort & Filter</Button>
            <FilterBarChips />
        </Paper>
      </HideOnScroll>
    </>
  )
}