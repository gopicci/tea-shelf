import React, { useState } from "react";
import { Box, Dialog, Fab, Toolbar } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/SearchAppBar";
import DrawerLayout from "./drawer/DrawerLayout";
import GridLayout from "./grid/GridLayout";
import FilterAccordion from "./filters/FilterAccordion";
import FilterBar from "./filters/FilterBar";
import Create from "./Create";
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

  const [desktopCreate, setDesktopCreate] = useState(false);

  function handleMobileCreate() {
    setRoute({ route: "CREATE" });
  }

  const desktop = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <>
      <SearchAppBar />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout setDesktopCreate={setDesktopCreate} />
        <Box className={classes.mainBox}>
          {desktop ? <FilterAccordion /> : <FilterBar setRoute={setRoute} />}
          <GridLayout setRoute={setRoute} />
        </Box>
        {desktop ? (
          <Dialog
            fullWidth={true}
            open={desktopCreate}
            onClose={() => setDesktopCreate(false)}
          >
            <Create desktop={true} setDesktopCreate={setDesktopCreate} />
          </Dialog>
        ) : (
          <Fab
            aria-label="add tea"
            className={classes.addButton}
            onClick={handleMobileCreate}
          >
            <CameraAlt />
          </Fab>
        )}
      </Box>
    </>
  );
}
