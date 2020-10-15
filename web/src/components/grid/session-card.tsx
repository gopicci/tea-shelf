import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import dateFormat from "dateformat";
import Countdown from "react-countdown";
import localforage from "localforage";
import { getEndDate } from "../../services/parsing-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { Route } from "../../app";
import { Clock, SessionInstance } from "../../services/models";
import { gridStyles } from "../../style/grid-styles";

/**
 * Countdown props.
 *
 * @memberOf SessionClock
 */
type CountdownProps = {
  minutes: number;
  seconds: number;
};

/**
 * SessionCard props.
 *
 * @memberOf SessionCard
 * @subcategory Main
 */
type Props = {
  /** Session instance data */
  session: SessionInstance;
  /** Grid or list mode */
  gridView: boolean;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Card component visualizing a single tea instance.
 *
 * @component
 * @subcategory Main
 */
function SessionCard({ session, gridView, setRoute }: Props): ReactElement {
  const classes = gridStyles();

  const clockRef = useRef({} as Countdown);

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const clocks = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);

  const [clock, setClock] = useState<Clock | undefined>();
  const [expired, setExpired] = useState(false);
  const [endDate, setEndDate] = useState(0);

  /**
   * Deletes session clock instance from global
   * state and cache.
   */
  const removeClock = useCallback(async (): Promise<void> => {
    try {
      if (clock !== undefined) {
        let cached = await localforage.getItem<Clock[]>("clocks");
        if (cached.length)
          await localforage.setItem<Clock[]>(
            "clocks",
            cached.filter((c) => c.offline_id !== session.offline_id)
          );
        await clockDispatch({
          type: "DELETE",
          data: {
            offline_id: session.offline_id,
            starting_time: clock.starting_time,
          },
        });
        setClock(undefined);
      }
    } catch (e) {
      console.error(e);
    }
  }, [clock, clockDispatch, session.offline_id]);

  /**
   * On countdown completion removes clock from global state
   * and cache, then updates brewing session.
   */
  const handleComplete = useCallback(async (): Promise<void> => {
    try {
      setExpired(false);
      await removeClock();

      await handleSessionEdit(
        {
          ...session,
          current_infusion: session.current_infusion + 1,
          last_brewed_on: new Date().toISOString(),
        },
        session.offline_id
      );
    } catch (e) {
      console.error(e);
    }
  }, [handleSessionEdit, removeClock, session]);

  useEffect(() => {
    async function clockInit() {
      // Search for a running clock in global state
      const match = clocks && clocks.find((c) => c.offline_id === session.offline_id);

      if (match) {
        setClock(match);
        const expiration = getEndDate(match.starting_time, session);
        if (expiration) {
          if (expiration < Date.now()) {
            setExpired(true);
            await handleComplete();
          }
          setEndDate(expiration);
        } else {
          setEndDate(getEndDate(Date.now(), session));
        }
      } else {
        setEndDate(getEndDate(Date.now(), session));
        setClock(undefined);
      }
    }
    clockInit();
  }, [clocks, handleComplete, session]);

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "SESSION_DETAILS", sessionPayload: session });
  }

  const createdOn = new Date(session.created_on);

  return (
    <Card
      variant="outlined"
      className={classes.cardPulse}
      style={!!(clock && !expired) ? undefined : { animation: "none" }}
    >
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
      >
        <CardContent className={classes.content}>
          <Box className={classes.rowSpace}>
            <Typography gutterBottom variant="caption">
              {gridView
                ? dateFormat(createdOn, "ddd dS")
                : dateFormat(createdOn, "dddd dS")}
            </Typography>
            <Typography gutterBottom variant="caption">
              {dateFormat(createdOn, "h:MM TT")}
            </Typography>
          </Box>
          <Typography
            gutterBottom
            variant="h5"
            className={classes.centerContent}
          >
            {session.name}
          </Typography>
          <Box className={classes.rowSpace}>
            <Typography variant="caption">
              Infusions: {session.current_infusion}
            </Typography>
            <Typography variant="caption">
              <Countdown
                key={endDate}
                date={endDate}
                ref={clockRef}
                autoStart={!!(clock && !expired)}
                renderer={({
                  minutes,
                  seconds,
                }: CountdownProps): ReactElement => {
                  return (
                    <span>
                      {String(minutes).padStart(2, "0")}:
                      {String(seconds).padStart(2, "0")}
                    </span>
                  );
                }}
                onComplete={handleComplete}
              />
            </Typography>
          </Box>
        </CardContent>
        {session.is_completed && <Box className={classes.disabledCard} />}
      </CardActionArea>
    </Card>
  );
}

export default SessionCard;
