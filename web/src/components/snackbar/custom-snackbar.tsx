import React, {ReactElement, useContext} from 'react';
import { ClickAwayListener, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";
import {
  SnackbarState,
  SnackbarDispatch,
} from "../statecontainers/snackbar-context";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

/**
 * Custom center top snackbar component used for major communications.
 * Relies on global snackbar state and dispatch provider.
 *
 * @component
 * @subcategory Main
 */
function CustomSnackbar(): ReactElement {
  const classes = useStyles();

  const state = useContext(SnackbarState);
  const dispatch = useContext(SnackbarDispatch);

  /** Resets snackbar state */
  function handleClose(): void {
    dispatch({ type: "RESET" });
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={state.open}
        autoHideDuration={6000}
        onClose={handleClose}
        className={classes.root}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={state.severity}
        >
          {state.message && state.message}
        </MuiAlert>
      </Snackbar>
    </ClickAwayListener>
  );
}

export default CustomSnackbar;
