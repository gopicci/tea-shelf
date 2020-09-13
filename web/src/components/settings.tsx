import React, { ReactElement, useContext, useState } from "react";
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
import PasswordResetForm from "./auth/password-reset-form";
import {
  SettingsDispatch,
  SettingsState,
} from "./statecontainers/settings-context";
import { getUser } from "../services/auth-services";
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
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    margin: "auto",
    marginBottom: theme.spacing(4),
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(3),
    marginTop: theme.spacing(3),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  passwordTitle: {
    margin: "auto",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Defines layout for app's main landing page.
 *
 * @component
 * @subcategory Main
 */
function Settings({ setRoute, isMobile }: Props): ReactElement {
  const classes = useStyles();

  const settings = useContext(SettingsState);
  const settingsDispatch = useContext(SettingsDispatch);
  const [reset, setReset] = useState(false);
  const email = getUser()?.email;

  /** Routes back to main */
  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  return (
    <>
      {isMobile && (
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
              <Typography variant="h5">Change Settings</Typography>
            </Toolbar>
          </GenericAppBar>
          <Toolbar />
        </>
      )}
      <Box className={classes.root}>
        {!isMobile && (
          <Box className={classes.title}>
            <Typography variant="h4">Change Settings</Typography>
          </Box>
        )}
        <Box className={classes.row}>
          <Typography variant="h5">Brewing type</Typography>
          <FormGroup>
            <FormControlLabel
              checked={!settings.gongfu}
              control={<Switch size="small" />}
              label={
                <Typography variant="h5">
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
                <Typography variant="h5">
                  {settings.metric ? "Metric" : "Imperial"}
                </Typography>
              }
              labelPlacement="start"
              onChange={() => settingsDispatch({ type: "SWITCH_UNITS" })}
            />
          </FormGroup>
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.passwordTitle}>
          <Typography variant="h4">Change Password</Typography>
        </Box>
        <PasswordResetForm
          setRoute={setRoute}
          email={email}
          reset={reset}
          setReset={setReset}
          endpoint="/password_update/"
        />
      </Box>
    </>
  );
}

export default Settings;
