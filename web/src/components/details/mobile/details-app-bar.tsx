import React, { MouseEvent, ReactElement, useContext } from "react";
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
import { APIRequest } from "../../../services/auth-services";
import { SnackbarDispatch } from "../../statecontainers/snackbar-context";
import { TeaDispatch } from "../../statecontainers/tea-context";
import { mobileDetailsStyles} from '../../../style/mobile-details-styles';
import { Route } from "../../../app";
import { TeaInstance } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

/**
 * DetailsAppbar props.
 *
 * @memberOf DetailsAppbar
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile tea details app bar.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsAppbar({ teaData, setRoute }: Props): ReactElement {
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | undefined>();
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);

  /** Routes back to main */
  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  /**
   * Opens menu.
   *
   * @param {MouseEvent<HTMLElement>} event - Icon button click event
   */
  function handleMenuClick(event: MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  /** Closes menu. */
  function handleMenuClose(): void {
    setAnchorEl(undefined);
  }

  /**
   *  Deletes tea instance and routes to main.
   */
  async function handleDelete(): Promise<void> {
    try {
      if (typeof teaData.id === "string")
        // ID is UUID, delete online tea
        await APIRequest(`/tea/${teaData.id}/`, "DELETE");
      else {
        // ID is not UUID, delete offline tea
        const offlineTeas = await localforage.getItem<TeaInstance[]>(
          "offline-teas"
        );
        let newOfflineTeas = [];
        for (const tea of offlineTeas)
          if (tea.id !== teaData.id) newOfflineTeas.push(tea);
        await localforage.setItem("offline-teas", newOfflineTeas);
      }
      setRoute({ route: "MAIN" });
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

export default DetailsAppbar;
