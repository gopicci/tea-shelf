import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
} from "@material-ui/core";
import {
  AccountCircle,
  Menu,
  Search,
  ViewStream,
  ViewModule,
} from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import SyncButton from "./sync-button";
import {
  GridViewState,
  GridViewDispatch,
} from "../statecontainers/grid-view-context";
import { SearchDispatch } from "../statecontainers/search-context";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: "block",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  title: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
      width: "25%",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1),
      width: "50%",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  user: {
    width: "25%",
    textAlign: "right",
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
}));

/**
 * Search app bar component. Handles search and grid view switch.
 *
 * @component
 * @subcategory Main
 */
function SearchAppBar() {
  const classes = useStyles();

  const [searchValue, setSearchValue] = useState("");

  const gridView = useContext(GridViewState);
  const gridViewDispatch = useContext(GridViewDispatch);
  const searchDispatch = useContext(SearchDispatch);

  useEffect(() => {
    if (searchValue === "")
      searchDispatch({
        type: "CLEAR",
      });
    else
      searchDispatch({
        type: "SET",
        data: searchValue,
      });
  }, [searchValue, searchDispatch]);

  /** Switches grid view global state. */
  function handleGridViewChange(): void {
    gridViewDispatch({
      type: "SWITCH_VIEW",
    });
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
        >
          <Menu />
        </IconButton>
        <Typography className={classes.title} variant="h6" noWrap>
          Tea shelf
        </Typography>
        <Box className={classes.search}>
          <Box className={classes.searchIcon}>
            <Search />
          </Box>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
          />
        </Box>
        <Box className={classes.user}>
          <SyncButton />
          <IconButton
            onClick={handleGridViewChange}
            color="inherit"
            aria-label="switch view"
          >
            {gridView ? <ViewStream /> : <ViewModule />}
          </IconButton>
          <IconButton color="inherit" aria-label="account">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SearchAppBar;
