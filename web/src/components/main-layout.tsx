import React, { ReactElement, useContext, useState } from "react";
import { Box, Fab, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/search-app-bar";
import DrawerLayout from "./drawer/drawer-layout";
import FilterBar from "./filters/filter-bar";
import FilterAccordion from "./filters/filter-accordion";
import GridLayout from "./grid/grid-layout";
import DialogLayout from "./dialog/dialog-layout";
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
  addButton: {
    position: "fixed",
    bottom: theme.spacing(4),
    right: theme.spacing(4),
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

  /** Sets route to CREATE */
  function handleCreate() {
    setRoute({ route: "CREATE" });
  }

  return (
    <>
      <SearchAppBar setOpen={setOpen} {...props} />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout open={open} setOpen={setOpen} {...props} />
        <Box className={classes.mainBox}>
          {teas.length > 0 &&
            (isMobile ? <FilterBar {...props} /> : <FilterAccordion />)}
          <GridLayout {...props} />
        </Box>
        {!isMobile &&
          ["CREATE", "TEA_DETAILS", "EDIT", "SETTINGS"].includes(route.route) && (
            <DialogLayout {...props} />
          )}
        {isMobile && (
          <Fab
            aria-label="add tea"
            color="secondary"
            className={classes.addButton}
            onClick={handleCreate}
          >
            <CameraAlt />
          </Fab>
        )}
      </Box>
    </>
  );
}

export default MainLayout;
