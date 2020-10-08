import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Countdown from "react-countdown";
import { parseHMSToSeconds } from "../../services/parsing-services";
import { SessionInstance } from "../../services/models";
import { ClockDispatch } from "../statecontainers/clocks-context";

const useStyles = makeStyles((theme) => ({
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
 * Countdown props.
 *
 * @memberOf SessionClock
 */
type CountdownProps = {
  minutes: number;
  seconds: number;
};

/**
 * SessionClock props.
 *
 * @memberOf SessionClock
 */
type Props = {
  /** Brewing session state */
  session: SessionInstance;
  /** Set brewing session state */
  setSession: (session: SessionInstance) => void;
};

/**
 * Brewing session countdown clock.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionClock({ session, setSession }: Props): ReactElement {
  const classes = useStyles();

  const clockDispatch = useContext(ClockDispatch);

  const [counting, setCounting] = useState(false);

  /**
   * Derives countdown time based on session brewing data and
   * current infusion.
   *
   * @returns {string}
   */
  const dateFromBrewing: () => number = useCallback(() => {
    const brewing = session.brewing;
    const initial = brewing.initial ? parseHMSToSeconds(brewing.initial) : 0;
    const increments = brewing.increments
      ? parseHMSToSeconds(brewing.increments)
      : 0;
    const total = initial + increments * (session.current_infusion - 1);
    return Date.now() + total * 1000;
  }, [session.brewing, session.current_infusion]);

  const [date, setDate] = useState(dateFromBrewing);

  useEffect(() => setDate(dateFromBrewing), [dateFromBrewing, session]);

  const clockRef = useRef({} as Countdown);

  /** Starts clock */
  function handleStart(): void {
    clockRef.current.start();
    setCounting(true);
    clockDispatch({
      type: "ADD",
      data: { id: session.id, starting_time: new Date().toISOString() },
    });
  }

  /** Resets clock */
  function handleCancel(): void {
    setDate(dateFromBrewing);
    setCounting(false);
    clockDispatch({
      type: "DELETE",
      data: { id: session.id },
    });
  }

  /**
   * On countdown completion updates brewing session
   * state incrementing current infusion
   * */
  function handleComplete(): void {
    setSession({ ...session, current_infusion: session.current_infusion + 1 });
    setCounting(false);
  }

  return (
    <Box className={classes.clockBox}>
      <Typography className={classes.clock}>
        <Countdown
          key={date}
          date={date}
          ref={clockRef}
          autoStart={false}
          renderer={({ minutes, seconds }: CountdownProps): ReactElement => {
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
      <Button
        variant="contained"
        color="secondary"
        disabled={session.is_completed}
        onClick={counting ? handleCancel : handleStart}
      >
        {counting ? "Cancel" : "Start"}
      </Button>
    </Box>
  );
}

export default SessionClock;
