import React, {useContext, useEffect, useState} from 'react';
import { Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TeaCard from './TeaCard';

import { teas } from '../../dev/DevData'
import { FilterState } from '../containers/FilterStateContainer';
import {GridViewState} from '../containers/GridViewStateContainer';

const useStyles = makeStyles((theme) => ({
  gridRoot: {
    margin: 'auto',
    padding: theme.spacing(2),
    maxWidth: '100%',
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listRoot: {
    margin: 'auto',
    maxWidth: 600,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  gridItem: {
    width: 200,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listItem: {
    width: '100%',
    padding: theme.spacing(1),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
}));


export default function GridLayout() {
  const classes = useStyles();

  const state = useContext(FilterState);

  const [filteredTeas, setFilteredTeas] = useState(teas);

  useEffect(() => {
    if (state.active > 0)
      setFilteredTeas(teas.filter((tea) =>
        state.filters.categories[tea.category.toLowerCase()]
        || state.filters.subcategories[tea.subcategory.toLowerCase()]
      ))
    else
      setFilteredTeas(teas);
  }, [state]);

  const gridView = useContext(GridViewState);


  return (
      <Grid container justify="center" className={gridView ? classes.gridRoot : classes.listRoot}>
        {
            filteredTeas.map(tea =>
              <Grid item className={gridView ? classes.gridItem : classes.listItem}>
                <TeaCard tea={tea} gridView={gridView} />
              </Grid>
          )
        }
      </Grid>
  )
}