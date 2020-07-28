import React from "react";
import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
}));

export default function InputAppBar({
  name,
  handleBackToLayout,
  showAdd = false,
  disableAdd = true,
  handleAdd = null,
}) {
  /**
   * Mobile tea creation appbar component.
   *
   * @param name {string} Input name
   * @param handleBackToLayout {function} Reroutes to input layout
   * @param showAdd {bool} Define presence of add button
   * @param disableAdd {bool} Define if add button is disabled
   * @param handleAdd {function} Handles add click

   */

  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          onClick={handleBackToLayout}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="back"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Add {name}
        </Typography>
        {showAdd && (
          <Button color="inherit" disabled={disableAdd} onClick={handleAdd}>
            ADD
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
