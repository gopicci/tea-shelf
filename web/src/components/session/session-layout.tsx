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
import localforage from "localforage";
import dateFormat from "dateformat";
import GenericAppBar from "../generics/generic-app-bar";
import SessionClock from "./session-clock";
import { getEndDate, parseHMSToSeconds } from "../../services/parsing-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { Clock, SessionInstance } from "../../services/models";
import { Route } from "../../app";

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

  const clocks = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);
  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const [session, setSession] = useState<SessionInstance>(
    route.sessionPayload ? route.sessionPayload : ({} as SessionInstance)
  );

  // Search for a running clock in global state
  const clock = clocks && clocks.find((c) => c.id === session.id);
  const expiration = clock && getEndDate(clock.starting_time, session);
  const expired = expiration && expiration < Date.now();
  if (expired) handleComplete();

  const [counting, setCounting] = useState(!!(clock && !expired));
  const [startDate, setStartDate] = useState(
    clock ? clock.starting_time : Date.now()
  );
  const [endDate, setEndDate] = useState(
    expiration ? expiration : getEndDate(Date.now(), session)
  );

  useEffect(() => {
    if (session !== route.sessionPayload) {
      handleSessionEdit(session, session.id);
    }
  }, [handleSessionEdit, route.sessionPayload, session]);

  /**
   * Adds counting clock to global state and cache.
   */
  async function addClock(): Promise<void> {
    try {
      setCounting(true);
      setStartDate(Date.now());
      const newClock = { id: session.id, starting_time: Date.now() };
      clockDispatch({
        type: "ADD",
        data: newClock,
      });
      let cachedClocks = await localforage.getItem<Clock[]>("clocks");
      if (cachedClocks) cachedClocks.push(newClock);
      else cachedClocks = [newClock];
      await localforage.setItem<Clock[]>("clocks", cachedClocks);
    } catch (e) {
      console.error(e);
      await handleCancel();
    }
  }

  /**
   * Resets countdown, deleting clock instance from global
   * state and cache.
   */
  async function handleCancel(): Promise<void> {
    try {
      setCounting(false);
      setEndDate(getEndDate(Date.now(), session));
      await removeClock();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * On countdown completion removes clock from global state
   * and cache, then updates brewing session.
   */
  async function handleComplete(): Promise<void> {
    try {
      await removeClock();

      setCounting(false);

      const increments = session.brewing.increments
        ? parseHMSToSeconds(session.brewing.increments)
        : 0;
      setEndDate(getEndDate(Date.now(), session) + increments * 1000);

      setSession({
        ...session,
        current_infusion: session.current_infusion + 1,
      });
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Deletes session clock instance from global
   * state and cache.
   */
  async function removeClock(): Promise<void> {
    try {
      let cachedClocks = await localforage.getItem<Clock[]>("clocks");
      if (cachedClocks)
        await localforage.setItem<Clock[]>(
          "clocks",
          cachedClocks.filter((c) => c.id !== session.id)
        );
      await clockDispatch({
        type: "DELETE",
        data: {
          id: session.id,
          starting_time: startDate,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEndSession(): Promise<void> {
    try {
      await handleCancel();
      await handleSessionEdit({ ...session, is_completed: true }, session.id);
    } catch (e) {
      console.error(e);
    }
    if (handleClose) handleClose();
    else setRoute({ route: "SESSIONS" });
  }

  function handleResumeSession(): void {
    setEndDate(getEndDate(Date.now(), session));
    setSession({ ...session, is_completed: false });
  }

  function handleBack(): void {
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
      {route.sessionPayload?.created_on && (
        <Typography variant="h5">
          Started on{" "}
          {dateFormat(
            new Date(route.sessionPayload.created_on),
            "dddd, mmmm dS, yyyy, h:MM TT"
          )}
        </Typography>
      )}
      <Box className={classes.row}>
        <Typography variant="h4">Temp {session.brewing.temperature}</Typography>
        <Typography variant="h4">
          Infusion {session.current_infusion}
        </Typography>
      </Box>
      <SessionClock
        session={session}
        date={endDate}
        counting={counting}
        addClock={addClock}
        handleCancel={handleCancel}
        handleComplete={handleComplete}
      />
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
