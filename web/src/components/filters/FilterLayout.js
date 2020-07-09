import React, { useContext, useState } from 'react';
import {Accordion, AccordionSummary, AccordionDetails, AccordionActions, Box, Button, Grid} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { fade, makeStyles } from '@material-ui/core/styles';

import FilterChips from './FilterChips';

import {FilterDispatch, FilterState} from '../containers/FilterStateContainer';
import FilterList from './FilterList';


const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      width: '80%',
    },
    margin: 'auto',
    marginTop: -theme.spacing(1),
    padding: 'auto',

  },
  listGrid: {
    display: 'flex',
    flexGrow: 1,
  },
  listItem: {
    minWidth: 220,
    flexGrow: 1,
    [theme.breakpoints.up('sm')]: {
      width: 200,
    },
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));


export default function FilterLayout() {
  const classes = useStyles();

  const state = useContext(FilterState)
  const dispatch = useContext(FilterDispatch)

  const [open, setOpen] = useState(false);

  const handleExpansion = () => {
    setOpen(!open);
  };

  const handleReset = () => {
    dispatch({
      type: "RESET"
    });
    setOpen(!open);
  };

  return (
    <Box className={ classes.root }>
      <Accordion
        elevation={0}
        expanded={open}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header"
          onClick={handleExpansion}
          >
          <FilterChips />
        </AccordionSummary>
        <AccordionDetails>
          <Grid container justify="center" className={classes.listGrid}>
            <Grid item className={classes.listItem}>
              <FilterList key='sortList' entry='sorting' list={state.sorting} />
            </Grid>
            {
              Object.entries(state.filters).map(([entry, list]) => (
                <Grid item className={classes.listItem}>
                  <FilterList key={entry} entry={entry} list={list}/>
                </Grid>
              ))
            }
          </Grid>
        </AccordionDetails>
        <AccordionActions className={classes.actions}>
          <Button size="small" color="primary" onClick={handleReset}>
            Reset
          </Button>
          <Button size="small" color="primary" onClick={handleExpansion}>
            Close
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  )
}