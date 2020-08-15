import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Toolbar,
} from "@material-ui/core";
import React from "react";
import { Add, Archive } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    width: drawerWidth,
    flexShrink: 0,
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function DrawerLayout({ setDesktopCreate }) {
  /**
   * Desktop left side drawer component.
   */

  const classes = useStyles();

  return (
    <Drawer
      className={classes.root}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer}>
        <Toolbar />
        <List>
          <ListItem button key="add" onClick={() => setDesktopCreate(true)}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Add Tea" />
          </ListItem>
          <ListItem button key="catalog">
            <ListItemIcon>
              <SvgIcon
                color="action"
                shapeRendering="geometricPrecision"
                viewBox="0 0 18.491 18.491"
              >
                <path d="M11.204 3.951c.015-.075.027-.15.027-.229 0-.773-.737-1.4-1.647-1.4-.909 0-1.646.627-1.646 1.4 0 .079.013.154.028.229-1.147.326-2.149.993-2.898 1.878h9.034c-.75-.885-1.751-1.551-2.898-1.878z" />
                <path d="M17.066 6.548c-.844-.42-1.846-.283-2.699.266H4.784c-.617.857-1.011 1.885-1.095 3-.104-.268-.152-.604-.127-1.028.07-1.178-.236-2.092-.911-2.719C1.615 5.105.161 5.265 0 5.287c0 0 .542.809.208 1.567 0 0 .869-.091 1.366.371.312.29.449.783.409 1.467-.071 1.195.237 2.111.917 2.722.322.29.683.466 1.03.573.74 2.421 2.991 4.182 5.653 4.182 2.245 0 4.197-1.251 5.199-3.093 1.229.104 2.567-.712 3.266-2.112.865-1.734.423-3.715-.982-4.416zm-.433 3.711c-.288.578-.771.978-1.242 1.102.067-.358.106-.727.106-1.104 0-.709-.13-1.386-.36-2.015.391-.256.821-.339 1.167-.167.615.307.767 1.307.329 2.184z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="My teas" />
          </ListItem>
          <ListItem button key="archive">
            <ListItemIcon>
              <Archive />
            </ListItemIcon>
            <ListItemText primary="Archive" />
          </ListItem>
          <ListItem button key="sessions">
            <ListItemIcon>
              <SvgIcon
                color="action"
                shapeRendering="geometricPrecision"
                viewBox="0 0 341.8 341.8"
              >
                <path d="M137 92l4 1a6 6 0 005-7c-3-12-1-22 4-28 6-9 9-20 7-30-1-8-6-16-13-21h-7c-2 2-3 4-2 6 3 13 0 21-6 32-5 8-7 17-5 25 1 9 6 17 13 22zM186 88l3 1a5 5 0 005-7c-2-8-1-15 3-19 5-7 7-15 5-23-1-7-4-12-10-16h-6c-2 1-3 4-2 6 2 8 0 14-5 22-3 6-5 13-4 19 1 7 5 13 11 17zM89 88l3 1a5 5 0 005-7c-1-8-1-15 3-19 5-7 7-15 6-23-1-7-5-12-11-16h-6c-2 1-3 4-2 6 2 8 0 14-5 22-3 6-4 13-3 19 1 7 4 13 10 17zM291 134c-6 0-15 1-24 7l-1-3h-1c-1-3-4-9-16-9H30c-4 0-11 1-15 10a146 146 0 0064 193c1 0 8 4 15 4h94c6 0 12-3 13-4 22-11 40-27 54-46h6c15 0 35-9 51-24 19-18 30-43 30-69 0-32-23-59-51-59zm-19 120a143 143 0 006-81c5-9 10-9 13-9 11 0 21 14 21 29 0 34-25 54-40 61z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Sessions" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
}
