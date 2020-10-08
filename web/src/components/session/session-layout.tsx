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
import { Clock, SessionInstance, SessionModel } from "../../services/models";
import { Route } from "../../app";
import dateFormat from "dateformat";
import { ClockDispatch, ClocksState } from "../statecontainers/clocks-context";
import {
  getFinishDate,
  parseHMSToSeconds,
} from "../../services/parsing-services";
import localforage from "localforage";

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

  const clocksState = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);
  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const [session, setSession] = useState<SessionInstance>(
    route.sessionPayload ? route.sessionPayload : ({} as SessionInstance)
  );

  // Searches for a running clock in global state
  const clock = clocksState.find((clock) => clock.id === session.id);
  const clockFinish = clock && getFinishDate(clock.starting_time, session);

  const [counting, setCounting] = useState(!!clock);

  const [startDate, setStartDate] = useState(
    clock ? clock.starting_time : Date.now()
  );
  const [finishDate, setFinishDate] = useState(
    clockFinish ? clockFinish : getFinishDate(Date.now(), session)
  );

  if (clockFinish && clockFinish < Date.now()) {
    handleComplete();
  }

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
      const clock = { id: session.id, starting_time: Date.now() };
      clockDispatch({
        type: "ADD",
        data: clock,
      });
      let clocks = await localforage.getItem<Clock[]>("clocks");
      if (clocks) clocks.push(clock);
      else clocks = [clock];
      await localforage.setItem<Clock[]>("clocks", clocks);
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
      setFinishDate(getFinishDate(Date.now(), session));
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
      setFinishDate(getFinishDate(Date.now(), session) + increments * 1000);

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
      await clockDispatch({
        type: "DELETE",
        data: {
          id: session.id,
          starting_time: startDate,
        },
      });

      let clocks = await localforage.getItem<Clock[]>("clocks");
      if (clocks)
        await localforage.setItem<Clock[]>(
          "clocks",
          clocks.filter((clock) => clock.id !== session.id)
        );
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEndSession() {
    try {
      await handleCancel();
      await handleSessionEdit({ ...session, is_completed: true }, session.id);
    } catch (e) {
      console.error(e);
    }
    if (handleClose) handleClose();
    else setRoute({ route: "SESSIONS" });
  }

  function handleResumeSession() {
    setFinishDate(getFinishDate(Date.now(), session));
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
        date={finishDate}
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
