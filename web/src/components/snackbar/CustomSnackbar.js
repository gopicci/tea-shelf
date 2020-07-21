import React, { useContext } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { SnackbarState, SnackbarDispatch } from "../statecontainers/SnackbarContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomSnackbar() {
  const classes = useStyles();

  const state = useContext(SnackbarState);
  const dispatch = useContext(SnackbarDispatch);

  function handleClose() {
    dispatch({type: "RESET"});
  }

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={state.open}
      autoHideDuration={6000}
      onClose={handleClose}
      className={classes.root}
    >
      {state.message && (
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={state.severity}
        >
          {state.message}
        </MuiAlert>
      )}
    </Snackbar>
  );
}
