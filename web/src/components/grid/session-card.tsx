import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
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
import localforage from "localforage";
import SessionCountdown from "../session/session-countdown";
import { isClockExpired } from "../../services/parsing-services";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import { ClockDispatch, ClocksState } from "../statecontainers/clock-context";
import { Route } from "../../app";
import { Clock, SessionInstance } from "../../services/models";
import { gridStyles } from "../../style/grid-styles";

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
 * Card component visualizing a single session instance.
 *
 * @component
 * @subcategory Grid
 */
function SessionCard({ session, gridView, setRoute }: Props): ReactElement {
  const classes = gridStyles();

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const clocks = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);

  const [clock, setClock] = useState<Clock | undefined>();

  /** Sets clock state */
  useEffect(() => {
    const match =
      clocks && clocks.find((c) => c.offline_id === session.offline_id);
    if (match) setClock(match);
    else setClock(undefined);
  }, [clocks, session.offline_id]);

  /**
   * Deletes session clock instance from global
   * state and cache.
   */
  const removeClock = useCallback(async (): Promise<void> => {
    try {
      if (clock) {
        await clockDispatch({
          type: "DELETE",
          data: clock,
        });

        let cached = await localforage.getItem<Clock[]>("clocks");
        if (cached.length) {
          await localforage.setItem<Clock[]>(
            "clocks",
            cached.filter((c) => c.offline_id !== clock.offline_id)
          );
        }

        setClock(undefined);
      }
    } catch (e) {
      console.error(e);
    }
  }, [clock, clockDispatch]);

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

  useEffect(() => {
    /** Updates session on expired clock */
    async function update() {
      if (clock && session) {
        if (isClockExpired(clock, session)) {
          // Clock is expired
          await handleComplete();
        }
      }
    }
    update();
  }, [clock, handleComplete, session]);

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "SESSION_DETAILS", sessionPayload: session });
  }

  const createdOn = new Date(session.created_on);

  return (
    <Card
      variant="outlined"
      className={classes.cardPulse}
      style={!!clock ? undefined : { animation: "none" }}
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
              Infusion: {session.current_infusion}
            </Typography>
            <Typography variant="caption">
              {session && (
                <SessionCountdown
                  session={session}
                  clock={clock}
                  handleComplete={handleComplete}
                />
              )}
            </Typography>
          </Box>
        </CardContent>
        {session.is_completed && <Box className={classes.disabledCard} />}
      </CardActionArea>
    </Card>
  );
}

export default SessionCard;
