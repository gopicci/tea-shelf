import React, { ReactElement, useContext, useState } from "react";
import {
  Box, Button,
  FormControlLabel,
  FormGroup,
  IconButton, List,
  Switch,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import GenericAppBar from '../../generics/generic-app-bar';
import {SettingsDispatch, SettingsState} from '../../statecontainers/settings-context';
import {getUser} from '../../../services/auth-services';
import PasswordResetForm from '../../auth/password-reset-form';
import {Route} from '../../../app';
import InputItem from './input-item';

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
 * InputSession props.
 *
 * @memberOf InputSession
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Mobile custom session creation input layout.
 *
 * @component
 * @subcategory Session
 */
function InputSession({ setRoute, isMobile }: Props): ReactElement {
  const classes = useStyles();



  /** Routes back to main */
  function handleBack(): void {
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
              <Typography variant="h5">Start Custom Brewing</Typography>
            </Toolbar>
          </GenericAppBar>
          <Toolbar />
        </>
      )}
      <Box className={classes.root}>
        <Box className={classes.row}>
          <InputItem
            key="infusion"
            name="first infusion"
            value={"00:00:00"}
            handleClick={() => {}}
          />
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.row}>
          <InputItem
            key="increments"
            name="increments"
            value={"00:00:00"}
            handleClick={() => {}}
          />
        </Box>
        <Box className={classes.divider} />
        <Button variant="contained" color="secondary">
          Start brewing
        </Button>
      </Box>
    </>
  );
}

export default InputSession;
