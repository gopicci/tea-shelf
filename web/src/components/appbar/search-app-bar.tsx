import React, {
  useContext,
  useState,
  useEffect,
  MouseEvent,
  ReactElement,
} from "react";
import {
  AppBar,
  Box,
  Toolbar,
  InputBase,
  IconButton,
  MenuItem,
  Menu,
  Tooltip,
  useScrollTrigger,
  InputAdornment,
} from "@material-ui/core";
import {
  AccountCircle,
  Search,
  Menu as MenuIcon,
  ViewStream,
  ViewModule,
  Clear,
} from "@material-ui/icons";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { appBarStyles } from "../../style/appbar-styles";
import SyncButton from "./sync-button";
import { logout } from "../../services/auth-services";
import {
  SettingsState,
  SettingsDispatch,
} from "../statecontainers/settings-context";
import { SearchDispatch } from "../statecontainers/search-context";
import titleImage from "../../media/title.png";
import { Route } from "../../app";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down("sm")]: {
      border: 0,
    },
  },
  titleBox: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      width: "25%",
    },
  },
  titleImage: {
    display: "block",
    height: theme.spacing(3),
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(1),
      width: "50%",
    },
  },
  inputIcon: {
    margin: theme.spacing(1, 2, 1, 2),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    fontSize: theme.typography.h5.fontSize,
    flexGrow: 1,
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
 * SearchAppBar props.
 *
 * @memberOf SearchAppBar
 */
type Props = {
  /** Set drawer open state */
  setOpen: (state: boolean) => void;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Search app bar component. Handles search and grid view switch.
 *
 * @component
 * @subcategory Main
 */
function SearchAppBar({ setOpen, setRoute, isMobile }: Props): ReactElement {
  const classes = useStyles();
  const appBarClasses = appBarStyles();

  const shadowTrigger = useScrollTrigger(
    isMobile
      ? undefined
      : {
          threshold: 1,
          disableHysteresis: true,
        }
  );

  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();
  const [searchValue, setSearchValue] = useState("");

  const settings = useContext(SettingsState);
  const settingsDispatch = useContext(SettingsDispatch);
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
    settingsDispatch({
      type: "SWITCH_VIEW",
    });
  }

  /**
   * Opens menu.
   *
   * @param {MouseEvent<HTMLElement>} event - Icon button click event
   */
  function handleMenuClick(event: MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  /** Closes menu. */
  function handleMenuClose(): void {
    setAnchorEl(undefined);
  }

  /** Open settings. */
  function handleSettings(): void {
    handleMenuClose();
    setRoute({ route: "SETTINGS" });
  }

  /** Logout. */
  function handleLogout(): void {
    handleMenuClose();
    logout();
  }

  return (
    <AppBar
      position="fixed"
      elevation={shadowTrigger ? 3 : 0}
      className={classes.appBar}
    >
      <Toolbar>
        <Box className={classes.titleBox}>
          <img
            src={titleImage}
            className={classes.titleImage}
            alt="Tea shelf"
          />
        </Box>
        <Box className={clsx(classes.search, appBarClasses.input)}>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            startAdornment={
              <InputAdornment position="start" className={classes.inputIcon}>
                {isMobile ? (
                  <IconButton
                    aria-label="open drawer"
                    size="small"
                    onClick={() => setOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <Search />
                )}
              </InputAdornment>
            }
            endAdornment={
              searchValue && (
                <InputAdornment position="end" className={classes.inputIcon}>
                  <IconButton
                    aria-label="clear search"
                    size="small"
                    onClick={() => setSearchValue("")}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )
            }
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
          />
        </Box>
        <Box className={classes.user}>
          <SyncButton />
          <Tooltip title={settings.gridView ? "List view" : "Grid view"}>
            <IconButton onClick={handleGridViewChange} aria-label="switch view">
              {settings.gridView ? <ViewStream /> : <ViewModule />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Account">
            <IconButton aria-label="user menu" onClick={handleMenuClick}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleSettings}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default SearchAppBar;
