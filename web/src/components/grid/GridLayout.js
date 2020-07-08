import React, {useContext} from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TeaCard from './TeaCard';

import { teas } from '../../dev/DevData'
import { FilterState } from '../containers/FilterStateContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
}));


export default function GridLayout() {
  const classes = useStyles();

  const state = useContext(FilterState)

  return (
    <Grid container justify="center" spacing={4} className={classes.root}>
      {

          teas.map(tea =>
            <Grid item><TeaCard tea={tea}/></Grid>
        )
      }
    </Grid>
  )
}