import React, { MouseEvent, ReactElement, useContext, useState } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  useScrollTrigger,
} from "@material-ui/core";
import {
  Archive,
  ArrowBack,
  Edit,
  MoreVert,
  Unarchive,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { deleteTea } from "../../../services/sync-services";
import { SnackbarDispatch } from "../../statecontainers/snackbar-context";
import { TeaDispatch } from "../../statecontainers/tea-context";
import { EditorContext } from "../../editor";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { Route } from "../../../app";
import { TeaInstance } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginLeft: theme.spacing(2),
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

  const shadowTrigger = useScrollTrigger({
    threshold: 1,
    disableHysteresis: true,
  });

  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();

  const handleEdit = useContext(EditorContext);
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

  /** Routes to tea instance edit page. */
  function handleEditClick(): void {
    setAnchorEl(undefined);
    setRoute({ route: "EDIT", payload: teaData });
  }

  /** Archives tea */
  function handleArchive(): void {
    setAnchorEl(undefined);
    handleEdit(
      { ...teaData, is_archived: true },
      teaData.id,
      "Tea successfully archived."
    );
    setRoute({ route: "MAIN", payload: teaData });
  }

  /** Unarchives tea */
  function handleUnArchive(): void {
    handleEdit(
      { ...teaData, is_archived: false },
      teaData.id,
      "Tea successfully unarchived."
    );
  }

  /**
   *  Deletes tea instance and routes to main.
   */
  async function handleDelete(): Promise<void> {
    try {
      await deleteTea(teaData);
      setRoute({ route: "MAIN" });
      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully deleted" });
      teaDispatch({ type: "DELETE", data: teaData });
    } catch (e) {
      console.error(e);
      snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
    }
  }

  return (
    <AppBar
      position="fixed"
      elevation={shadowTrigger ? 3 : 0}
      style={{ border: 0 }}
    >
      <Toolbar>
        <Box className={detailsClasses.grow}>
          <IconButton
            onClick={handleBack}
            edge="start"
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
        </Box>
        <Box>
          {teaData.is_archived ? (
            <IconButton
              className={classes.icon}
              onClick={handleUnArchive}
              size="small"
              aria-label="unarchive"
            >
              <Unarchive fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              className={classes.icon}
              onClick={handleArchive}
              size="small"
              aria-label="archive"
            >
              <Archive fontSize="small" />
            </IconButton>
          )}
          <IconButton
            className={classes.icon}
            onClick={handleEditClick}
            size="small"
            aria-label="archive"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            className={classes.icon}
            size="small"
            color="inherit"
            aria-label="menu"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVert fontSize="small" />
          </IconButton>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DetailsAppbar;
