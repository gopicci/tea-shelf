import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import GenericAppBar from "../generics/generic-app-bar";
import SessionClock from "./session-clock";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { SessionInstance } from "../../services/models";
import { Route } from "../../app";
import dateFormat from "dateformat";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    minWidth: "100%",
    justifyContent: "space-between",
  },
  endButton: {
    width: "100%",
  },
}));

/**
 * SessionLayout props.
 *
 * @memberOf SessionLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
  /** Handles dialog close */
  handleClose?: () => void;
};

/**
 * Brewing session layout component.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionLayout({
  route,
  setRoute,
  isMobile,
  handleClose,
}: Props): ReactElement {
  const classes = useStyles();

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const date = route.sessionPayload?.created_on
    ? new Date(route.sessionPayload.created_on)
    : undefined;

  const [session, setSession] = useState<SessionInstance>(
    route.sessionPayload ? route.sessionPayload : ({} as SessionInstance)
  );

  useEffect(() => {
    if (session !== route.sessionPayload) {
      handleSessionEdit(session, session.id);
    }
  }, [handleSessionEdit, route.sessionPayload, session]);

  async function handleEndSession() {
    try {
      await handleSessionEdit({ ...session, is_completed: true }, session.id);
    } catch (e) {
      console.error(e);
    }
    if (handleClose) handleClose();
    else setRoute({ route: "SESSIONS" });
  }

  function handleResumeSession() {
    setSession({ ...session, is_completed: false });
  }

  function handleBack() {
    setRoute({ route: "SESSIONS" });
  }

  return (
    <Box className={classes.root}>
      {isMobile && (
        <>
          <GenericAppBar>
            <Toolbar>
              <Box className={classes.row}>
                <IconButton edge="start" aria-label="back" onClick={handleBack}>
                  <ArrowBack />
                </IconButton>
              </Box>
            </Toolbar>
          </GenericAppBar>
          <Toolbar />
        </>
      )}
      <Typography variant="h1">{session.name}</Typography>
      {date && (
        <Typography variant="h5">
          Started on {dateFormat(date, "dddd, mmmm dS, yyyy, h:MM TT")}
        </Typography>
      )}
      <Box className={classes.row}>
        <Typography variant="h4">Temp {session.brewing.temperature}</Typography>
        <Typography variant="h4">
          Infusion {session.current_infusion}
        </Typography>
      </Box>
      <SessionClock session={session} setSession={setSession} />
      {session.is_completed ? (
        <Button className={classes.endButton} onClick={handleResumeSession}>
          Resume session
        </Button>
      ) : (
        <Button className={classes.endButton} onClick={handleEndSession}>
          End session
        </Button>
      )}
    </Box>
  );
}

export default SessionLayout;
