import React, {Dispatch, ReactElement, useContext} from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import FilterList from "./filters/FilterList";
import { FilterDispatch, FilterState } from "./statecontainers/filter-context";
import { Route } from '../app';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
}));

/**
 * SortFilter props.
 *
 * @memberOf SortFilter
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile only sort and filter page component.
 *
 * @component
 */
export default function SortFilter({ setRoute }: Props): ReactElement {
  const classes = useStyles();

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  console.log(state);

  function handleClose() {
    setRoute({ route: "MAIN" });
  }

  function handleReset() {
    dispatch({
      type: "RESET",
    });
  }

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={handleClose}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Sort & Filter
          </Typography>
          <Button color="inherit" onClick={handleReset}>
            RESET
          </Button>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <FilterList key="sortList" entry="sorting" list={state.sorting} />
      {Object.entries(state.filters).map(([entry, list]) => (
        <FilterList entry={entry} list={list} />
      ))}
    </Box>
  );
}
