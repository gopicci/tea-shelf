import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Box,
  CircularProgress,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
} from "@material-ui/core";
import {
  AccountCircle,
  CloudDone,
  Menu,
  Refresh,
  Search,
  ViewStream,
  ViewModule,
} from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import { uploadOffline } from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import {
  GridViewState,
  GridViewDispatch,
} from "../statecontainers/grid-view-context";
import { TeaDispatch } from "../statecontainers/tea-context";
import { SubcategoriesDispatch } from "../statecontainers/subcategories-context";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import { VendorsDispatch } from "../statecontainers/vendors-context";
import { SearchDispatch } from "../statecontainers/search-context";
import { SyncState, SyncDispatch } from "../statecontainers/sync-context";
import { TeaInstance } from "../../services/models";

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
  circularProgress: {
    color: theme.palette.common.white,
  },
}));

/**
 * Search app bar component. Handles search, sync and grid view switch.
 *
 * @component
 * @subcategory Main
 */
function SearchAppBar() {
  const classes = useStyles();

  const [isSyncing, setSyncing] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const gridView = useContext(GridViewState);
  const sync = useContext(SyncState);
  const syncDispatch = useContext(SyncDispatch);
  const gridViewDispatch = useContext(GridViewDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorDispatch = useContext(VendorsDispatch);
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

  /** Switches grid view global state */
  function handleGridViewChange(): void {
    gridViewDispatch({
      type: "SWITCH_VIEW",
    });
  }

  /** Syncs global states and local caches with API */
  async function handleRefresh(): Promise<void> {
    setSyncing(true);
    let error = null;

    try {
      // Try to upload offline tea entries
      await uploadOffline();
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Get remaining offline teas
      const offlineTeas = await localforage.getItem<TeaInstance[]>(
        "offline-teas"
      );

      // Download teas from API
      const res = await APIRequest("/tea/", "GET");
      const body = await res.json();

      // Update central teas state
      teaDispatch({ type: "SET", data: offlineTeas.concat(body) });

      // Update teas cache
      await localforage.setItem("teas", body);
    } catch (e) {
      console.error(e);
      error = e;
    }
    try {
      // Download categories from API
      const res = await APIRequest("/category/", "GET");
      const body = await res.json();

      // Update central categories state
      subcategoriesDispatch({ type: "SET", data: body });

      // Update categories cache
      await localforage.setItem("categories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download subcategories from API
      const res = await APIRequest("/subcategory/", "GET");
      const body = await res.json();

      // Update central subcategories state
      subcategoriesDispatch({ type: "SET", data: body });

      // Update subcategories cache
      await localforage.setItem("subcategories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download vendors from API
      const res = await APIRequest("/vendor/", "GET");
      const body = await res.json();

      // Update central vendors state
      vendorDispatch({ type: "SET", data: body });

      // Update vendors cache
      await localforage.setItem("vendors", body);
    } catch (e) {
      console.error(e);
      error = e;
    }
    setSyncing(false);

    // Update global sync context
    if (error) {
      syncDispatch({ type: "SET_NOT_SYNCED" });
      snackbarDispatch({ type: "ERROR", data: error.message });
    } else {
      syncDispatch({ type: "SET_SYNCED" });
    }
  }

  useEffect(() => {
    handleRefresh();
  }, []);

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
          {isSyncing ? (
            <IconButton color="inherit" aria-label="refresh">
              <CircularProgress
                className={classes.circularProgress}
                size={20}
                thickness={5}
              />
            </IconButton>
          ) : sync ? (
            <IconButton color="inherit" aria-label="refresh">
              <CloudDone />
            </IconButton>
          ) : (
            <IconButton
              color="inherit"
              aria-label="refresh"
              onClick={handleRefresh}
            >
              <Refresh />
            </IconButton>
          )}
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
