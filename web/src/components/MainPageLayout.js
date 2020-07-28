import React from "react";
import { Box, Fab, Toolbar } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/SearchAppBar";
import DrawerLayout from "./drawer/DrawerLayout";
import GridLayout from "./grid/GridLayout";
import FilterAccordion from "./filters/FilterAccordion";
import FilterBar from "./filters/FilterBar";
import { mainTheme as theme } from "../style/MainTheme";

const useStyles = makeStyles((theme) => ({
  page: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: theme.palette.background.main,
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

export default function MainPageLayout({ setRoute }) {
  /**
   * Defines layout for main landing page.
   *
   * @param setRoute {function} Set main route
   */

  const classes = useStyles();

  function handleCreate() {
    setRoute({route: "CREATE"});
  }

  const upSmall = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <SearchAppBar />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout />
        <Box className={classes.mainBox}>
          {upSmall ? <FilterAccordion /> : <FilterBar setRoute={setRoute} />}
          <GridLayout setRoute={setRoute} />
        </Box>
        <Fab
          aria-label="add tea"
          className={classes.addButton}
          onClick={handleCreate}
        >
          <CameraAlt />
        </Fab>
      </Box>
    </>
  );
}
