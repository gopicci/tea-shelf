import React, { ReactElement, useContext, useEffect } from "react";
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
import FilterList from "./filter-list";
import { FilterDispatch, FilterState } from "../statecontainers/filter-context";
import { Route } from "../../app";
import { Filters } from "../../services/models";

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
 * @subcategory Main
 */
function SortFilter({ setRoute }: Props): ReactElement {
  const classes = useStyles();

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  useEffect(() => {
    /**
     * Applies custom behavior on browser history pop event.
     *
     * @param {PopStateEvent} event - Popstate event
     * @memberOf SortFilter
     */
    function onBackButtonEvent(event: PopStateEvent): void {
      event.preventDefault();
      setRoute({ route: "MAIN" });
    }

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [setRoute]);

  /** Sets route to main */
  function handleClose() {
    setRoute({ route: "MAIN" });
  }

  /** Resets filter state */
  function handleReset() {
    dispatch({
      type: "RESET",
    });
  }

  return (
    <Box className={classes.root}>
      <AppBar position="fixed" elevation={0}>
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
        <FilterList entry={entry as keyof Filters["filters"]} list={list} />
      ))}
    </Box>
  );
}

export default SortFilter;
