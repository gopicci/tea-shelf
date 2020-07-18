import React from 'react';
import {Box, Checkbox, FormControlLabel, ListItem, Toolbar, Typography} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';
import {formListStyles} from '../../style/FormListStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    flexGrow: 1,
  },
  checkbox: {
    flexGrow: 1,
    textAlign: 'right',
    justifyContent: 'right',
    paddingRight: theme.spacing(2),
  },
  labelTypography: {
    fontSize: 15,
    flexGrow: 1,
    color: '#666',
    textTransform: 'capitalize',
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
  const formListClasses = formListStyles();

  return (
    <ListItem className={formListClasses.listItem} key={name} button>
      <Box className={formListClasses.listItemBox}>
      <FormControlLabel
        labelPlacement="start"
        className={classes.label}
        control={
            <Checkbox
              className={classes.checkbox}
              checked={checked}
              onChange={handleChange}
              name={name}
              checkedIcon={<Check className={classes.checkIcon} />}
              icon={<Check className={classes.checkIcon} visibility='hidden' />}
            />}
        label={<Typography className={classes.labelTypography}>{name}</Typography>}
      />
      </Box>
    </ListItem>
  )
}