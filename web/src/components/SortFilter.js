import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { FilterDispatch, FilterState } from "./statecontainers/FilterContext";
import FilterList from "./filters/FilterList";

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

export default function SortFilter({ setRoute }) {
  const classes = useStyles();

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  console.log(state);

  const handleClose = () => setRoute("MAIN");

  const handleReset = () => {
    dispatch({
      type: "RESET",
    });
  };

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={handleClose}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
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
