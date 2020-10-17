import React, { ReactElement, useContext, useState } from "react";
import { Box, Button, Fab, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/search-app-bar";
import DrawerLayout from "./drawer/drawer-layout";
import FilterBar from "./filters/filter-bar";
import FilterAccordion from "./filters/filter-accordion";
import GridLayout from "./grid/grid-layout";
import DialogLayout from "./dialog/dialog-layout";
import SessionBar from './session/session-bar';
import { TeasState } from "./statecontainers/tea-context";
import { Route } from "../app";

const useStyles = makeStyles((theme) => ({
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.default,
  },
  mainBox: {
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    display: "block",
    flexGrow: 1,
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
  },
  addSession: {
    display: "block",
    margin: "auto",
    border: `solid 1px ${theme.palette.divider}`,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
  },
}));

/**
 * MainLayout props.
 *
 * @memberOf MainLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Defines layout for app's main landing page.
 *
 * @component
 * @subcategory Main
 */
function MainLayout(props: Props): ReactElement {
  const classes = useStyles();

  const { route, setRoute, isMobile } = props;

  const teas = useContext(TeasState);

  // Drawer state
  const [open, setOpen] = useState(false);

  /** Sets route to CREATE_TEA */
  function handleCreateTea(): void {
    setRoute({ route: "CREATE_TEA" });
  }

  /** Sets route to CREATE_SESSION */
  function handleCreateSession(): void {
    setRoute({ route: "CREATE_SESSION" });
  }

  return (
    <>
      <SearchAppBar setOpen={setOpen} {...props} />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout open={open} setOpen={setOpen} {...props} />
        <Box className={classes.mainBox}>
          {["SESSIONS", "CREATE_SESSION", "SESSION_DETAILS"].includes(
            route.route
          ) ? (
            isMobile ? (
              // Mobile sessions
              <SessionBar {...props} />
            ) : (
              // Desktop sessions
              <Button
                className={classes.addSession}
                onClick={handleCreateSession}
              >
                Custom brewing
              </Button>
            )
          ) : (
            // Main or archive
            teas.length > 0 &&
            (isMobile ? <FilterBar {...props} /> : <FilterAccordion />)
          )}
          <GridLayout {...props} />
        </Box>
        {!isMobile &&
          [
            "CREATE_TEA",
            "TEA_DETAILS",
            "EDIT_TEA",
            "CREATE_SESSION",
            "SETTINGS",
            "CONFIRMATION",
            "SESSION_DETAILS",
          ].includes(route.route) && <DialogLayout {...props} />}
        {isMobile && route.route !== "SESSIONS" && (
          <Fab
            aria-label="add tea"
            color="secondary"
            className={classes.fab}
            onClick={handleCreateTea}
          >
            <CameraAlt />
          </Fab>
        )}
      </Box>
    </>
  );
}

export default MainLayout;
