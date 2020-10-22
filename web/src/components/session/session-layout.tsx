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
import SessionCountdown from "./session-countdown";
import EditInfusion from "../input/mobile/edit-infusion";
import InfusionAutocomplete from "../input/desktop/infusion-autocomplete";
import { celsiusToFahrenheit } from "../../services/parsing-services";
import {
  handleSessionComplete,
  removeClock,
} from "../../services/sync-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { SessionsState } from "../statecontainers/session-context";
import { Clock, SessionInstance } from "../../services/models";
import { Route } from "../../app";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexShrink: 1,
    margin: 0,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      minHeight: `calc(100% - ${theme.spacing(8)}px)`,
    },
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
  name: {
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up("md")]: {
      marginTop: theme.spacing(4),
    },
  },
  suggestions: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-end",
    marginLeft: theme.spacing(2),
  },
  spaceTop: {
    marginTop: theme.spacing(1),
  },
  icon: {
    color: theme.palette.primary.main,
    width: theme.spacing(3),
    height: theme.spacing(3),
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
  infusionBox: {
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(2),
    width: "120px",
  },
  infusion: {
    fontSize: theme.spacing(6),
  },
  endButton: {
    width: "100%",
  },
  countdownBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
    margin: theme.spacing(2),
  },
  countdown: {
    lineHeight: 1,
    marginBottom: theme.spacing(2),
    fontSize: 160,
    [theme.breakpoints.down("sm")]: {
      fontSize: "28vw",
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
    const now = Date.now();
    const newClock = {
      offline_id: session.offline_id,
      starting_time: now,
    };
    try {
      setStartDate(now);
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
      await removeClock(newClock, clockDispatch);
    }
  }

  /**
   * Wrapper around removeClock callback that prioritizes clock state
   * over session and start date.
   */
  async function handleRemoveClock(): Promise<void> {
    await removeClock(
      clock
        ? clock
        : { offline_id: session.offline_id, starting_time: startDate },
      clockDispatch
    );
  }

  /**
   * Wrapper around handleSessionComplete callback that checks for clock
   * state.
   */
  async function handleComplete(): Promise<void> {
    if (clock) {
      try {
        await handleSessionComplete(
          clock,
          session,
          clockDispatch,
          handleSessionEdit
        );
      } catch (e) {
        console.error(e);
      }
    }
  }

  /** Deletes clock and set session as complete. */
  async function handleEndSession(): Promise<void> {
    try {
      await handleRemoveClock();
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

  /** Set session as not complete. */
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

  /** Deletes clock and cancel infusion editing. */
  async function handleBackToLayout(): Promise<void> {
    await handleRemoveClock();
    setEditInfusion(false);
  }

  /** Routes back to sessions. */
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
      <Typography variant="h1" className={classes.name}>
        {session.name}
      </Typography>
      <Box className={clsx(classes.row, classes.spaceBetween)}>
        <Box className={classes.suggestions}>
          {!!(
            session.brewing.temperature && session.brewing.temperature > 0
          ) && (
            <Box className={clsx(classes.row, classes.spaceTop)}>
              <SvgIcon className={classes.icon} viewBox="0 0 24 24">
                <path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1z" />
              </SvgIcon>
              <Box>
                <Typography variant="h4">
                  {session.brewing.temperature}°c -{" "}
                  {celsiusToFahrenheit(session.brewing.temperature)}F
                </Typography>
              </Box>
            </Box>
          )}
          {!!(session.brewing.weight && session.brewing.weight > 0) && (
            <Box className={clsx(classes.row, classes.spaceTop)}>
              <FitnessCenter className={classes.icon} />
              <Typography variant="h4">
                {session.brewing.weight}g/100ml
              </Typography>
            </Box>
          )}
        </Box>
        {isMobile ? (
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
        ) : (
          <Box className={classes.infusionBox}>
            <InfusionAutocomplete
              session={session}
              removeClock={handleRemoveClock}
            />
          </Box>
        )}
      </Box>
      <Box className={classes.countdownBox}>
        <Typography className={classes.countdown}>
          <SessionCountdown
            session={session}
            clock={clock}
            handleComplete={handleComplete}
          />
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          disabled={session.is_completed}
          onClick={clock ? handleRemoveClock : addClock}
        >
          {clock ? "Cancel" : "Start"}
        </Button>
      </Box>
      {session.is_completed ? (
        <Button
          color="secondary"
          className={classes.endButton}
          onClick={handleResumeSession}
        >
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
