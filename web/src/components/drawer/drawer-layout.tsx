import React, { ReactElement } from "react";
import { Drawer, SwipeableDrawer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import DrawerContent from "./drawer-content";
import { Route } from "../../app";

const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    display: "flex",
  },
  drawerPaper: {
    width: 240,
    border: 0,
  },
}));

/**
 * DrawerLayout props.
 *
 * @memberOf DrawerLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
  /** Drawer open state */
  open: boolean;
  /** Set drawer open state */
  setOpen: (state: boolean) => void;
};

/**
 * Drawer component. Swipeable on mobile, permanent on desktop.
 *
 * @component
 * @subcategory Main
 */
function DrawerLayout(props: Props): ReactElement {
  const { isMobile, open, setOpen } = props;

  const classes = useStyles();

  return isMobile ? (
    <SwipeableDrawer
      className={clsx(classes.root, classes.drawerPaper)}
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <DrawerContent {...props} />
    </SwipeableDrawer>
  ) : (
    <Drawer
      className={clsx(classes.root, classes.drawerPaper)}
      classes={{
        paper: classes.drawerPaper,
      }}
      variant="permanent"
    >
      <DrawerContent {...props} />
    </Drawer>
  );
}

export default DrawerLayout;
