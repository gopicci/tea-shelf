import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Chip, Typography } from '@material-ui/core';
import {FilterDispatch, FilterState} from '../statecontainers/FilterContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',

    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(15),
  },
}));

export default function FilterAccordionChips() {
  const classes = useStyles();
  const state = useContext(FilterState)
  const dispatch = useContext(FilterDispatch)

  const handleDelete = (event, entry, item) => {
    dispatch({
      type: "CHECK_FILTER",
      data: { entry: entry, item: item }
    });
  };

  const handleReset = (event) => {
    event.stopPropagation();
    dispatch({
      type: "CLEAR"
    });
  };

  return (
    <Box className={classes.root}>
      {
        !state.active &&
        <Typography className={classes.title}>Sort & Filter</Typography>
      }
      {
        state.active > 0 &&
          <Button size='small' color='primary' disableElevation onClick={handleReset}>Clear</Button>
      }
      {
        Object.entries(state.filters).map(([entry, list]) => (
          list &&
          Object.entries(list).map(([item, checked]) => (
            item &&
            checked &&
             <Chip
                key={item}
                name={item}
                label={item}
                onClick={e => { e.stopPropagation() }}
                onDelete={e => handleDelete(e, entry, item)}
                size='small'
              />
          ))
        ))
      }
    </Box>
  );
}