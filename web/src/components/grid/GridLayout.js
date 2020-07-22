import React, {useContext, useEffect, useState} from 'react';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import TeaCard from './TeaCard';

import {TeasState} from '../statecontainers/TeasContext';
import {FilterState} from '../statecontainers/FilterContext';
import {GridViewState} from '../statecontainers/GridViewContext';

import {CategoriesState} from '../statecontainers/CategoriesContext';
import {SubcategoriesState} from '../statecontainers/SubcategoriesContext';

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
  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const filterState = useContext(FilterState);
  const teas = useContext(TeasState)

  const [filteredTeas, setFilteredTeas] = useState(teas);

  useEffect(() => {
    if (filterState.active > 0)
      setFilteredTeas(teas.filter((tea) => {
        const categoryName = categories.find(category => category.id === tea.category)
        return filterState.filters.categories[categoryName.name.toLowerCase()]
        //|| state.filters.subcategories[tea.subcategory.toLowerCase()]
        }
      ))
    else
      setFilteredTeas(teas);
  }, [filterState, categories, subcategories, teas]);

  const gridView = useContext(GridViewState);

  let width = window.innerWidth;

  return (
      <Grid container justify="center" className={gridView ? classes.gridRoot : classes.listRoot}>
        {
          filteredTeas &&
            filteredTeas.map(tea =>
              <Grid item className={gridView && width > 600 ? classes.gridItem : classes.listItem} key={tea.name}>
                <TeaCard tea={tea} gridView={gridView && width > 600} />
              </Grid>
          )
        }
      </Grid>
  )
}