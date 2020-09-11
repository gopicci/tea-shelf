import React, { ReactElement, useContext } from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import GenericAppBar from "./generics/generic-app-bar";
import {
  SettingsDispatch,
  SettingsState,
} from "./statecontainers/settings-context";
import { Route } from "../app";

const useStyles = makeStyles((theme) => ({
  back: {
    marginRight: theme.spacing(2),
  },
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    margin: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(3),
    marginTop: theme.spacing(3),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
}));

/**
 * Settings props.
 *
 * @memberOf Settings
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Defines layout for app's main landing page.
 *
 * @component
 * @subcategory Main
 */
function Settings({ setRoute }: Props): ReactElement {
  const classes = useStyles();

  const settings = useContext(SettingsState);
  const settingsDispatch = useContext(SettingsDispatch);

  /** Routes back to main */
  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  return (
    <>
      <GenericAppBar>
        <Toolbar>
          <IconButton
            onClick={handleBack}
            edge="start"
            className={classes.back}
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6">Change Settings</Typography>
        </Toolbar>
      </GenericAppBar>
      <Toolbar />
      <Box className={classes.root}>
        <Box className={classes.row}>
          <Typography variant="h5">Brewing type</Typography>
          <FormGroup>
            <FormControlLabel
              checked={!settings.gongfu}
              control={<Switch size="small" />}
              label={
                <Typography variant="caption">
                  {settings.gongfu ? "Gongfu" : "Western"}
                </Typography>
              }
              labelPlacement="start"
              onChange={() => settingsDispatch({ type: "SWITCH_BREWING" })}
            />
          </FormGroup>
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.row}>
          <Typography variant="h5">Unit system</Typography>
          <FormGroup>
            <FormControlLabel
              checked={!settings.metric}
              control={<Switch size="small" />}
              label={
                <Typography variant="caption">
                  {settings.metric ? "Metric" : "Imperial"}
                </Typography>
              }
              labelPlacement="start"
              onChange={() => settingsDispatch({ type: "SWITCH_UNITS" })}
            />
          </FormGroup>
        </Box>
      </Box>
    </>
  );
}

export default Settings;
