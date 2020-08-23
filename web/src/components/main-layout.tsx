import React, { ReactElement } from "react";
import { Box, Fab, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/SearchAppBar";
import DrawerLayout from "./drawer/drawer-layout";
import GridLayout from "./grid/grid-layout";
import FilterAccordion from "./filters/FilterAccordion";
import FilterBar from "./filters/FilterBar";
import DialogLayout from "./dialog/DialogLayout";
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
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
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
 */
function MainLayout(props: Props): ReactElement {
  const classes = useStyles();

  const { route, setRoute, isMobile } = props;

  /** Sets route to CREATE */
  function handleCreate() {
    setRoute({ route: "CREATE" });
  }

  return (
    <>
      <SearchAppBar />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout setRoute={setRoute} />
        <Box className={classes.mainBox}>

          <GridLayout {...props} />
        </Box>
        {isMobile && (
          <Fab
            aria-label="add tea"
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
