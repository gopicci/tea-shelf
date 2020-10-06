import React, { ReactElement } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Toolbar,
} from "@material-ui/core";
import { Add, Archive, Eco, ExitToApp, Settings } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../generics/logo";
import { logout } from "../../services/auth-services";
import { Route } from "../../app";

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: "auto",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  item: {
    marginTop: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      borderRadius: `0px ${theme.spacing(4)}px ${theme.spacing(4)}px 0px`,
      margin: 0,
    },
  },
  itemText: {
    color: theme.palette.text.primary,
  },
  selectedIcon: {
    color: theme.palette.secondary.main,
  },
  logo: {
    width: "50%",
    margin: "auto",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  unitsLabel: {
    color: theme.palette.text.primary,
  },
  unitsSwitch: {
    marginLeft: theme.spacing(2.5),
    marginRight: theme.spacing(2.75),
  },
}));

/**
 * DrawerContent props.
 *
 * @memberOf DrawerContent
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
  /** Set drawer open state */
  setOpen: (state: boolean) => void;
};

/**
 * Drawer component content.
 *
 * @component
 * @subcategory Main
 */
function DrawerContent({
  route,
  setRoute,
  isMobile,
  setOpen,
}: Props): ReactElement {
  const classes = useStyles();

  function handleClick(route: Route): void {
    setRoute(route);
    if (isMobile) {
      setOpen(false);
    }
  }

  return (
    <Box className={classes.root}>
      {!isMobile && <Toolbar />}
      <Box className={classes.content}>
        <List>
          {isMobile && (
            <Box className={classes.logo}>
              <Logo />
            </Box>
          )}
          {!isMobile && (
            <ListItem
              className={classes.item}
              button
              key="add"
              onClick={() => handleClick({ route: "CREATE" })}
              aria-label="add tea"
            >
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Tea" className={classes.itemText} />
            </ListItem>
          )}
          <ListItem
            className={classes.item}
            button
            key="catalog"
            selected={route.route === "MAIN"}
            onClick={() => handleClick({ route: "MAIN" })}
          >
            <ListItemIcon
              className={
                route.route === "MAIN" ? classes.selectedIcon : undefined
              }
            >
              <Eco />
            </ListItemIcon>
            <ListItemText
              primary="Teas"
              className={route.route !== "MAIN" ? classes.itemText : undefined}
            />
          </ListItem>
          <ListItem
            className={classes.item}
            button
            key="archive"
            selected={route.route === "ARCHIVE"}
            onClick={() => handleClick({ route: "ARCHIVE" })}
          >
            <ListItemIcon
              className={
                route.route === "ARCHIVE" ? classes.selectedIcon : undefined
              }
            >
              <Archive />
            </ListItemIcon>
            <ListItemText
              primary="Archive"
              className={
                route.route !== "ARCHIVE" ? classes.itemText : undefined
              }
            />
          </ListItem>
          <ListItem
            className={classes.item}
            button
            key="sessions"
            selected={route.route === "SESSIONS"}
            onClick={() => handleClick({ route: "SESSIONS" })}
          >
            <ListItemIcon
              className={
                route.route === "SESSIONS" ? classes.selectedIcon : undefined
              }
            >
              <SvgIcon
                shapeRendering="geometricPrecision"
                viewBox="0 0 18.491 18.491"
              >
                <path d="M11.204 3.951c.015-.075.027-.15.027-.229 0-.773-.737-1.4-1.647-1.4-.909 0-1.646.627-1.646 1.4 0 .079.013.154.028.229-1.147.326-2.149.993-2.898 1.878h9.034c-.75-.885-1.751-1.551-2.898-1.878z" />
                <path d="M17.066 6.548c-.844-.42-1.846-.283-2.699.266H4.784c-.617.857-1.011 1.885-1.095 3-.104-.268-.152-.604-.127-1.028.07-1.178-.236-2.092-.911-2.719C1.615 5.105.161 5.265 0 5.287c0 0 .542.809.208 1.567 0 0 .869-.091 1.366.371.312.29.449.783.409 1.467-.071 1.195.237 2.111.917 2.722.322.29.683.466 1.03.573.74 2.421 2.991 4.182 5.653 4.182 2.245 0 4.197-1.251 5.199-3.093 1.229.104 2.567-.712 3.266-2.112.865-1.734.423-3.715-.982-4.416zm-.433 3.711c-.288.578-.771.978-1.242 1.102.067-.358.106-.727.106-1.104 0-.709-.13-1.386-.36-2.015.391-.256.821-.339 1.167-.167.615.307.767 1.307.329 2.184z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Sessions"
              className={
                route.route !== "SESSIONS" ? classes.itemText : undefined
              }
            />
          </ListItem>
        </List>
        {isMobile && (
          <List>
            <ListItem
              className={classes.item}
              button
              key="settings"
              onClick={() => handleClick({ route: "SETTINGS" })}
            >
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem
              className={classes.item}
              button
              key="logout"
              onClick={() => logout()}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        )}
      </Box>
    </Box>
  );
}

export default DrawerContent;
