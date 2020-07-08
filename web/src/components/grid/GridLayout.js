import React from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import TeaCard from './TeaCard';


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));


export default function GridLayout() {
const classes = useStyles();
  return (
    <Grid container justify="center" spacing={4} className={classes.root}>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
      <Grid item><TeaCard/></Grid>
    </Grid>
  )
}