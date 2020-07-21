import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
} from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  AccountCircle,
  CloudDone,
  Menu,
  Refresh,
  Search,
  ViewStream,
  ViewModule,
} from "@material-ui/icons";

import {getOfflineTeas, syncOffline} from '../../services/SyncService';

import {
  GridViewState,
  GridViewDispatch,
} from "../statecontainers/GridViewContext";
import { TeaDispatch } from "../statecontainers/TeasContext";
import { SubcategoriesDispatch } from "../statecontainers/SubcategoriesContext";
import {SnackbarDispatch} from '../statecontainers/SnackbarContext';
import localforage from "localforage";
import {APIRequest} from '../../services/AuthService';

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

export default function SearchAppBar({handleSnackbarOpen}) {
  const classes = useStyles();

  const [isSyncing, setSyncing] = useState(false);
  const [showCloud, setShowCloud] = useState(false);

  const state = useContext(GridViewState);
  const gridViewDispatch = useContext(GridViewDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);

  function handleGridViewChange() {
    gridViewDispatch({
      type: "SWITCH_VIEW",
    });
  }

  async function handleRefresh() {
    setSyncing(true);
    let error = null;
    try {
      await syncOffline();
    } catch(e) {
      console.error(e);
      error = e;
    }
    try {
      const offlineTeas = await getOfflineTeas();

      const res = await APIRequest("/tea/", "GET");
      const body = await res.json();

      teaDispatch({ type: "SET", data: offlineTeas.concat(body) });

      await localforage.setItem("teas", body);
    } catch (e) {
      console.error(e);
      error = e;
    }
    try {
      const res = await APIRequest("/subcategory/", "GET");
      const body = await res.json();

      subcategoriesDispatch({ type: "SET", data: body });

      await localforage.setItem("subcategories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    setSyncing(false);

    if (error) {
      snackbarDispatch({type: 'ERROR', data: error.message});
    } else {
      setShowCloud(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setShowCloud(false);
    }
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
          />
        </Box>
        <Box className={classes.user}>
          <IconButton color="inherit" aria-label="refresh">
            {isSyncing ? (
              <CircularProgress color="white" size='sm'/>
            ) : showCloud ? (
              <CloudDone />
            ) : (
              <Refresh onClick={handleRefresh} />
            )}
          </IconButton>
          <IconButton
            onClick={handleGridViewChange}
            color="inherit"
            aria-label="switch view"
          >
            {state ? <ViewStream /> : <ViewModule />}
          </IconButton>
          <IconButton color="inherit" aria-label="account">
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
