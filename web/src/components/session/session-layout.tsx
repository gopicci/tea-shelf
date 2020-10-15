import React, { ReactElement, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  SvgIcon,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack, FitnessCenter } from "@material-ui/icons";
import localforage from "localforage";
import dateFormat from "dateformat";
import GenericAppBar from "../generics/generic-app-bar";
import SessionClock from "./session-clock";
import {
  celsiusToFahrenheit,
  getEndDate,
  parseHMSToSeconds,
} from "../../services/parsing-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { Clock, SessionInstance } from "../../services/models";
import { Route } from "../../app";
import EditInfusion from "../input/mobile/edit-infusion";
import clsx from "clsx";

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
    alignItems: "center",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    marginLeft: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  icon: {
    color: theme.palette.text.secondary,
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  infusionButton: {
    "& .MuiButton-label": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(2),
    padding: theme.spacing(2),
  },
  infusion: {
    fontSize: theme.spacing(6),
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

  const [editInfusion, setEditInfusion] = useState(false);

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
      setEndDate(getEndDate(Date.now(), session));
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

  function handleBackToLayout(): void {
    handleCancel();
    setEditInfusion(false);
  }

  function handleBack(): void {
    setRoute({ route: "SESSIONS" });
  }

  return editInfusion ? (
    <EditInfusion
      session={session}
      setSession={setSession}
      handleBackToLayout={handleBackToLayout}
    />
  ) : (
    <Box className={classes.root}>
      {isMobile && (
        <>
          <GenericAppBar>
            <Toolbar>
              <Box className={clsx(classes.row, classes.spaceBetween)}>
                <IconButton edge="start" aria-label="back" onClick={handleBack}>
                  <ArrowBack />
                </IconButton>
                {route.sessionPayload?.created_on && (
                  <Typography variant="h5">
                    {dateFormat(
                      new Date(route.sessionPayload.created_on),
                      "d mmm yyyy, h:MM TT"
                    )}
                  </Typography>
                )}
              </Box>
            </Toolbar>
          </GenericAppBar>
          <Toolbar />
        </>
      )}
      <Typography variant="h1">{session.name}</Typography>
      <Box className={clsx(classes.row, classes.spaceBetween)}>
        <Box className={classes.suggestions}>
          {!!(session.brewing.temperature && session.brewing.temperature > 0) && (
            <Box className={classes.row}>
              <SvgIcon className={classes.icon} viewBox="0 0 24 24">
                <path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1z" />
              </SvgIcon>
              <Box>
                <Typography variant="h4">
                  {session.brewing.temperature}°c
                </Typography>
                <Typography variant="h4">
                  {celsiusToFahrenheit(session.brewing.temperature)}F
                </Typography>
              </Box>
            </Box>
          )}
          {!!(session.brewing.weight && session.brewing.weight > 0) && (
            <Box className={classes.row}>
              <FitnessCenter className={classes.icon} />
              <Typography variant="h4">
                {session.brewing.weight}g/100ml
              </Typography>
            </Box>
          )}
        </Box>
        {isMobile && (
          <Button
            variant="outlined"
            className={classes.infusionButton}
            onClick={() => setEditInfusion(true)}
            disabled={session.is_completed}
          >
            <Typography variant="h4">Infusion</Typography>
            <Typography variant="h1" className={classes.infusion}>
              {session.current_infusion}
            </Typography>
          </Button>
        )}
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
