import React, { MouseEvent, ReactElement, useContext, useState } from "react";
import { Box, IconButton, Menu, MenuItem, Tooltip } from "@material-ui/core";
import { Archive, Edit, MoreVert, Unarchive } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { deleteTea } from "../../services/sync-services";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import { TeaDispatch } from "../statecontainers/tea-context";
import { TeaEditorContext } from "../edit-tea";
import { Route } from "../../app";
import { TeaInstance } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginLeft: theme.spacing(2),
  },
}));

/**
 * ActionIcons props.
 *
 * @memberOf ActionIcons
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Ask for confirmation before deleting */
  confirmDelete?: boolean;
};

/**
 * Icon buttons with common actions related to a tea instance.
 * To be used in instance details components.
 *
 * @component
 * @subcategory Generics
 */
function ActionIcons({
  teaData,
  setRoute,
  confirmDelete,
}: Props): ReactElement {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();

  const handleTeaEdit = useContext(TeaEditorContext);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);

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
    setRoute({ route: "EDIT_TEA", teaPayload: teaData });
  }

  /** Archives tea */
  function handleArchive(): void {
    setAnchorEl(undefined);
    handleTeaEdit(
      { ...teaData, is_archived: true },
      teaData.offline_id,
      "Tea successfully archived."
    );
    setRoute({ route: "MAIN" });
  }

  /** Unarchives tea */
  function handleUnArchive(): void {
    handleTeaEdit(
      { ...teaData, is_archived: false },
      teaData.offline_id,
      "Tea successfully unarchived."
    );
    setRoute({ route: "ARCHIVE" });
  }

  /**
   *  Deletes tea instance and routes to main.
   */
  async function handleDelete(): Promise<void> {
    try {
      await deleteTea(teaData);
      setRoute({ route: "MAIN" });
      snackbarDispatch({
        type: "SUCCESS",
        data: "Tea successfully deleted",
      });
      teaDispatch({ type: "DELETE", data: teaData });
    } catch (e) {
      console.error(e);
      snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
    }
  }

  /**
   * Asks for confirmation before deleting.
   */
  async function handleConfirmation(): Promise<void> {
    if (confirmDelete)
      setRoute({
        route: "CONFIRMATION",
        confirmation: {
          message: "Delete " + teaData.name + "?",
          callback: handleDelete,
        },
      });
    else await handleDelete();
  }

  return (
    <Box>
      {teaData.is_archived ? (
        <Tooltip title="Unarchive">
          <IconButton
            className={classes.icon}
            onClick={handleUnArchive}
            size="small"
            aria-label="unarchive"
          >
            <Unarchive fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Archive">
          <IconButton
            className={classes.icon}
            onClick={handleArchive}
            size="small"
            aria-label="archive"
          >
            <Archive fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Edit">
        <IconButton
          className={classes.icon}
          onClick={handleEditClick}
          size="small"
          aria-label="edit"
        >
          <Edit fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="More">
        <IconButton
          className={classes.icon}
          size="small"
          aria-label="menu"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleConfirmation}>Delete</MenuItem>
      </Menu>
    </Box>
  );
}

export default ActionIcons;
