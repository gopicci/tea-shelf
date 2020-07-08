import React, { useState } from 'react';
import {Checkbox, FormControlLabel, ListItem, Toolbar, Typography} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    flexGrow: 1,
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  checkbox: {
    flexGrow: 1,
    textAlign: 'right',
  },
  labelTypography: {
    fontSize: 15,
    flexGrow: 1,
    color: '#666',
  },
  checkIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginTop: -theme.spacing(1),
    marginBottom: -theme.spacing(1),
  },
}));

export default function FilterItem({ name, checked, handleChange }) {
  const classes = useStyles();

return (
  <ListItem className={classes.root} key={name} button>
    <FormControlLabel
      labelPlacement="start"
      className={classes.label}
      control={
        <div className={classes.checkbox}>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            name={name}
            checkedIcon={<Check className={classes.checkIcon} />}
            icon={<Check className={classes.checkIcon} visibility='hidden' />}
          />
        </div>}
      label={<Typography className={classes.labelTypography}>{name}</Typography>}
    />
  </ListItem>
  )
}