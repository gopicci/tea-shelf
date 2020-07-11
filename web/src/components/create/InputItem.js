import React from 'react';
import {Box, FormControlLabel, ListItem, ListItemIcon, ListItemText, Toolbar, Typography} from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Check } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
    display: 'flex',
    minWidth: 0,
    width: '100vw',
  },
  buttonBox: {
    display: 'flex',
    flexGrow: 1,
    minWidth: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  nameBox: {
    width: theme.spacing(13),
  },
  valueBox: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }
}));

export default function InputItem({ name, value, handleClick }) {
  const classes = useStyles();

  return (
    <ListItem button className={classes.root} id={name} onClick={handleClick}>
      <Box className={classes.buttonBox}>
        <Box className={classes.nameBox}>{name}</Box>
        <Box className={classes.valueBox}>{value}</Box>
      </Box>
    </ListItem>
  )
}