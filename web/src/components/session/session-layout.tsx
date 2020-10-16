import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
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
import clsx from "clsx";
import GenericAppBar from "../generics/generic-app-bar";
import SessionClock from "./session-clock";
import EditInfusion from "../input/mobile/edit-infusion";
import { celsiusToFahrenheit } from "../../services/parsing-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { Clock, SessionInstance } from "../../services/models";
import { Route } from "../../app";
import { SessionsState } from "../statecontainers/session-context";

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
  clockBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },
  clock: {
    lineHeight: 1,
    marginBottom: theme.spacing(2),
    fontSize: 200,
    [theme.breakpoints.down("sm")]: {
      fontSize: "30vw",
    },
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

  const sessions = useContext(SessionsState);
  const clocks = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);
  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const [clock, setClock] = useState<Clock | undefined>();
  const [startDate, setStartDate] = useState(
    clock ? clock.starting_time : Date.now()
  );
  const [editInfusion, setEditInfusion] = useState(false);

  const getSession = useCallback(
    (offline_id: number): SessionInstance => {
      const session = Object.values(sessions).find(
        (s) => s.offline_id === offline_id
      );
      return session ? session : ({} as SessionInstance);
    },
    [sessions]
  );

  const [session, setSession] = useState<SessionInstance>(
    route.sessionPayload
      ? getSession(route.sessionPayload.offline_id)
      : ({} as SessionInstance)
  );

  useEffect(() => {
    const match =
      clocks && clocks.find((c) => c.offline_id === session.offline_id);
    if (match) setClock(match);
    else setClock(undefined);
  }, [clocks, session.offline_id]);

  useEffect(() => {
    if (route.sessionPayload)
      setSession(getSession(route.sessionPayload.offline_id));
  }, [getSession, route.sessionPayload]);

  /**
   * Adds counting clock to global state and cache.
   */
  async function addClock(): Promise<void> {
    try {
      setStartDate(Date.now());
      const newClock = {
        offline_id: session.offline_id,
        starting_time: Date.now(),
      };
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
      await removeClock();
    }
  }

  /**
   * Deletes session clock instance from global
   * state and cache.
   */
  const removeClock = useCallback(async (): Promise<void> => {
    try {
      let cachedClocks = await localforage.getItem<Clock[]>("clocks");
      if (cachedClocks)
        await localforage.setItem<Clock[]>(
          "clocks",
          cachedClocks.filter((c) => c.offline_id !== session.offline_id)
        );
      await clockDispatch({
        type: "DELETE",
        data: {
          offline_id: session.offline_id,
          starting_time: startDate,
        },
      });
    } catch (e) {
      console.error(e);
    }
  }, [clockDispatch, session.offline_id, startDate]);

  /**
   * On countdown completion removes clock from global state
   * and cache, then updates brewing session.
   */
  const handleComplete = useCallback(async (): Promise<void> => {
    if (clock) {
      try {
        const newSession = {
          ...session,
          current_infusion: session.current_infusion + 1,
          last_brewed_on: new Date(clock.starting_time).toISOString(),
        };
        await removeClock();
        await handleSessionEdit(newSession, session.offline_id);
      } catch (e) {
        console.error(e);
      }
    }
  }, [clock, handleSessionEdit, removeClock, session]);

  async function handleEndSession(): Promise<void> {
    try {
      await removeClock();
      await handleSessionEdit(
        { ...session, is_completed: true },
        session.offline_id
      );
    } catch (e) {
      console.error(e);
    }
    if (handleClose) handleClose();
    else setRoute({ route: "SESSIONS" });
  }

  async function handleResumeSession(): Promise<void> {
    try {
      await handleSessionEdit(
        { ...session, is_completed: false },
        session.offline_id
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function handleBackToLayout(): Promise<void> {
    await removeClock();
    setEditInfusion(false);
  }

  function handleBack(): void {
    setRoute({ route: "SESSIONS" });
  }

  return editInfusion ? (
    <EditInfusion session={session} handleBackToLayout={handleBackToLayout} />
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
              </Box>
            </Toolbar>
          </GenericAppBar>
          <Toolbar />
        </>
      )}
      <Typography variant="h1">{session.name}</Typography>
      <Box className={clsx(classes.row, classes.spaceBetween)}>
        <Box className={classes.suggestions}>
          {!!(
            session.brewing.temperature && session.brewing.temperature > 0
          ) && (
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
      <Box className={classes.clockBox}>
        <Typography className={classes.clock}>
          <SessionClock
            session={session}
            clock={clock}
            handleComplete={handleComplete}
          />
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          disabled={session.is_completed}
          onClick={clock ? removeClock : addClock}
        >
          {clock ? "Cancel" : "Start"}
        </Button>
      </Box>
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
