import React, { ReactElement, useContext, useRef, useState } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import dateFormat from "dateformat";
import Countdown from "react-countdown";
import { gridStyles } from "../../style/grid-styles";
import { Route } from "../../app";
import { Clock, SessionInstance } from "../../services/models";
import { ClockDispatch, ClocksState } from "../statecontainers/clocks-context";
import { HandleSessionEdit, SessionEditorContext } from "../edit-session";
import {
  getFinishDate,
  parseHMSToSeconds,
} from "../../services/parsing-services";
import localforage from "localforage";

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

  const clocksState = useContext(ClocksState);
  const clockDispatch = useContext(ClockDispatch);
  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  // Search for a running clock in global state
  const clock = clocksState.find((clock) => clock.id === session.id);
  const clockFinish = clock && getFinishDate(clock.starting_time, session);

  const [counting, setCounting] = useState(!!clock);

  const [finishDate, setFinishDate] = useState(
    clockFinish ? clockFinish : getFinishDate(Date.now(), session)
  );

  if (clockFinish && clockFinish < Date.now()) handleComplete();

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

      handleSessionEdit(
        {
          ...session,
          current_infusion: session.current_infusion + 1,
        },
        session.id
      );
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
      if (clock) {
        await clockDispatch({
          type: "DELETE",
          data: {
            id: session.id,
            starting_time: clock.starting_time,
          },
        });

        let clocks = await localforage.getItem<Clock[]>("clocks");
        if (clocks)
          await localforage.setItem<Clock[]>(
            "clocks",
            clocks.filter((clock) => clock.id !== session.id)
          );
      }
    } catch (e) {
      console.error(e);
    }
  }

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "SESSION_DETAILS", sessionPayload: session });
  }

  const createdOn = new Date(session.created_on);

  return (
    <Card variant="outlined">
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
          <Box className={classes.bottomBox}>
            <Box className={classes.rowSpace}>
              <Typography variant="caption">
                Infusions: {session.current_infusion}
              </Typography>
              <Typography variant="caption">
                <Countdown
                  key={finishDate}
                  date={finishDate}
                  ref={clockRef}
                  autoStart={counting}
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
          </Box>
        </CardContent>
        {session.is_completed && <Box className={classes.disabledCard} />}
      </CardActionArea>
    </Card>
  );
}

export default SessionCard;
