import React, { ReactElement, useContext, useState } from "react";
import {
  Box,
  Button,
  Fab,
  ListItemIcon,
  SvgIcon,
  Toolbar,
} from "@material-ui/core";
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

  /** Sets route to CREATE */
  function handleCreate(): void {
    setRoute({ route: "CREATE" });
  }

  return (
    <>
      <SearchAppBar setOpen={setOpen} {...props} />
      <Toolbar />
      <Box className={classes.page}>
        <DrawerLayout open={open} setOpen={setOpen} {...props} />
        <Box className={classes.mainBox}>
          {route.route === "SESSIONS"
            ? !isMobile && (
                <Button className={classes.addSession}>Start brewing</Button>
              )
            : teas.length > 0 &&
              (isMobile ? <FilterBar {...props} /> : <FilterAccordion />)}
          <GridLayout {...props} />
        </Box>
        {!isMobile &&
          [
            "CREATE",
            "TEA_DETAILS",
            "EDIT",
            "SETTINGS",
            "CONFIRMATION",
          ].includes(route.route) && <DialogLayout {...props} />}
        {isMobile &&
          (route.route === "SESSIONS" ? (
            <Fab
              aria-label="start brewing"
              color="secondary"
              className={classes.fab}
              onClick={handleCreate}
            >
              <SvgIcon
                shapeRendering="geometricPrecision"
                viewBox="0 0 18.491 18.491"
              >
                <path d="M11.204 3.951c.015-.075.027-.15.027-.229 0-.773-.737-1.4-1.647-1.4-.909 0-1.646.627-1.646 1.4 0 .079.013.154.028.229-1.147.326-2.149.993-2.898 1.878h9.034c-.75-.885-1.751-1.551-2.898-1.878z" />
                <path d="M17.066 6.548c-.844-.42-1.846-.283-2.699.266H4.784c-.617.857-1.011 1.885-1.095 3-.104-.268-.152-.604-.127-1.028.07-1.178-.236-2.092-.911-2.719C1.615 5.105.161 5.265 0 5.287c0 0 .542.809.208 1.567 0 0 .869-.091 1.366.371.312.29.449.783.409 1.467-.071 1.195.237 2.111.917 2.722.322.29.683.466 1.03.573.74 2.421 2.991 4.182 5.653 4.182 2.245 0 4.197-1.251 5.199-3.093 1.229.104 2.567-.712 3.266-2.112.865-1.734.423-3.715-.982-4.416zm-.433 3.711c-.288.578-.771.978-1.242 1.102.067-.358.106-.727.106-1.104 0-.709-.13-1.386-.36-2.015.391-.256.821-.339 1.167-.167.615.307.767 1.307.329 2.184z" />
              </SvgIcon>
            </Fab>
          ) : (
            <Fab
              aria-label="add tea"
              color="secondary"
              className={classes.fab}
              onClick={handleCreate}
            >
              <CameraAlt />
            </Fab>
          ))}
      </Box>
    </>
  );
}

export default MainLayout;
