import React from "react";
import { Box, Fab, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { CameraAlt } from "@material-ui/icons";
import SearchAppBar from "./appbar/SearchAppBar";
import DrawerLayout from "./drawer/DrawerLayout";
import GridLayout from "./grid/GridLayout";
import FilterAccordion from "./filters/FilterAccordion";
import FilterBar from "./filters/FilterBar";
import DialogLayout from "./dialog/DialogLayout";

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

/**
 * Defines layout for main landing page.
 *
 * @param props {[]} Base app props for router management and mobile state
 */
export default function MainPageLayout(props) {
  const classes = useStyles();

  const { router, setRouter, isMobile } = props;

  function handleCreate() {
    setRouter({ route: "CREATE" });
  }

  return (
    <>
      <SearchAppBar />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout {...props} />
        <Box className={classes.mainBox}>
          {isMobile ? <FilterBar {...props} /> : <FilterAccordion />}
          <GridLayout {...props} />
        </Box>
        {!isMobile &&
          ["CREATE", "TEA_DETAILS", "EDIT"].includes(router.route) && (
            <DialogLayout {...props} />
          )}
        {isMobile && (
          <Fab
            aria-label="add tea"
            className={classes.addButton}
            onClick={handleCreate}
          >
            <CameraAlt />
          </Fab>
        )}
        )}
      </Box>
    </>
  );
}
