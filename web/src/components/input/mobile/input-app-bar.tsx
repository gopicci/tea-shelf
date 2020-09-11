import React, { ReactElement } from "react";
import { Button, IconButton, Toolbar, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import GenericAppBar from "../../generics/generic-app-bar";

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
 * InputAppBar props.
 *
 * @memberOf InputAppBar
 */
type Props = {
  /** Input name */
  name: string;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
  /** Defines name of title action */
  actionName?: string;
  /** Defines presence and name of save button */
  saveName?: string;
  /** Defines if add button is disabled */
  disableSave?: boolean;
  /** Handles save button click */
  handleSave?: () => void;
};

/**
 * Mobile tea editing appbar component. Used in a few
 * components related to the tea creation/editing process.
 *
 * @component
 * @subcategory Mobile input
 */
function InputAppBar({
  name,
  handleBackToLayout,
  actionName = "Edit",
  saveName,
  disableSave = true,
  handleSave,
}: Props): ReactElement {
  const classes = useStyles();

  return (
    <>
      <GenericAppBar>
        <Toolbar>
          <IconButton
            onClick={handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {actionName} {name}
          </Typography>
          {saveName && (
            <Button
              color="secondary"
              disabled={disableSave}
              onClick={handleSave}
              aria-label={saveName}
            >
              {saveName}
            </Button>
          )}
        </Toolbar>
      </GenericAppBar>
      <Toolbar />
    </>
  );
}

export default InputAppBar;
