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

/**
 * Mobile tea creation appbar component.
 *
 * @param name {string} Input name
 * @param handleBackToLayout {function} Reroutes to input layout
 * @param actionName {string} Define name of title action
 * @param saveName {string} Define presence and name of save button
 * @param disableAdd {boolean} Define if add button is disabled
 * @param handleSave {function} Handles save click
 */
export default function InputAppBar({
  name,
  handleBackToLayout,
  actionName = "Edit",
  saveName = null,
  disableSave = true,
  handleSave = null,
}) {
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
          {actionName} {name}
        </Typography>
        {saveName && (
          <Button
            color="inherit"
            disabled={disableSave}
            onClick={handleSave}
            aria-label={saveName}
          >
            {saveName}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
