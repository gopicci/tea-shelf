import React, { useContext } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
} from "@material-ui/core";
import { ArrowBack, MoreVert } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import { APIRequest } from "../../../services/AuthService";
import { SnackbarDispatch } from "../../statecontainers/SnackbarContext";
import { TeaDispatch } from "../../statecontainers/TeasContext";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 * Mobile tea details page app bar.
 *
 * @param setRouter {function} Set main route
 * @param teaData {Object} Track the input state
 */
export default function DetailsAppbar({ setRouter, teaData }) {
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);

  function handleBack() {
    setRouter({ route: "MAIN" });
  }

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  async function handleDelete() {
    try {
      if (String(teaData.id).length > 5)
        // Delete online tea
        await APIRequest(`/tea/${teaData.id}/`, "DELETE");
      else {
        // Delete offline tea
        const offlineTeas = await localforage.getItem("offline-teas");
        let newOfflineTeas = [];
        for (const tea of offlineTeas)
          if (tea.id !== teaData.id) newOfflineTeas.push(tea);
        await localforage.setItem("offline-teas", newOfflineTeas);
      }
      setRouter({ route: "MAIN" });
      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully deleted" });
      teaDispatch({ type: "DELETE", data: teaData });
    } catch (e) {
      console.error(e);
      snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
    }
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Box className={detailsClasses.grow}>
          <IconButton
            onClick={handleBack}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
        </Box>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVert />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Archive</MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
