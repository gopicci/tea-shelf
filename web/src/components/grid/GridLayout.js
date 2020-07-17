import React, {useContext, useEffect, useState} from 'react';
import {Button, Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

import TeaCard from './TeaCard';

import  {APIRequest} from '../../services/AuthService';
import {FileToBase64} from '../../services/ImageService';

import {TeasState} from '../statecontainers/TeasContext';
import {FilterContext} from '../statecontainers/FilterContext';
import {GridViewState} from '../statecontainers/GridViewContext';

import localforage from "localforage";

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

  const state = useContext(FilterContext);
  const teas = useContext(TeasState)

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

  const [testTeas, setTestTeas] = useState(null);
  const [offlineTeas, setOfflineTeas] = useState(null)

  useEffect(() => {
    APIRequest('/tea/', 'GET')
      .then(res => {
        console.log('/tea/', res)
        if (res.ok)
          res.json().then(body => {
            setTestTeas(body);
            localforage.setItem('teas', body)
              .then(cache => console.log('set local teas', cache))
          })
      })

    localforage.getItem('offline-teas').then(cache => {
      if (cache)
        Promise.all(cache.map(entry => FileToBase64(entry.image)
            .then(img => {
              entry.image = img;
              entry.category = parseInt(entry.category);
              return entry
            })
        ))
          .then(teas => setOfflineTeas(teas));
    })

  }, [])

  return (
      <Grid container justify="center" className={gridView ? classes.gridRoot : classes.listRoot}>
        {
          teas &&
            teas.map(tea =>
              <Grid item className={gridView ? classes.gridItem : classes.listItem} key={tea.id}>
                <TeaCard tea={tea} gridView={gridView} />
              </Grid>
          )
        }
      </Grid>
  )
}