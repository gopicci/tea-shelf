import React, { ReactElement, useEffect, useRef } from "react";
import { Box, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Countdown from "react-countdown";
import { SessionInstance } from "../../services/models";

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
  /** Countdown date */
  date: number;
  /** Countdown counting state */
  counting: boolean;
  /** Adds counting clock to global state and cache */
  addClock: () => void;
  /** Handles countdown completion */
  handleComplete: () => void;
  /** Handles countdown cancellation */
  handleCancel: () => void;
};

/**
 * Brewing session countdown clock.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionClock({
  session,
  date,
  counting,
  addClock,
  handleComplete,
  handleCancel,
}: Props): ReactElement {
  const classes = useStyles();

  const clockRef = useRef({} as Countdown);

  /**
   * Starts countdown, adding clock to global state and cache.
   */
  function handleStart(): void {
    clockRef.current.start()
    addClock();
  }

  return (
    <Box className={classes.clockBox}>
      <Typography className={classes.clock}>
        <Countdown
          key={date}
          date={date}
          ref={clockRef}
          autoStart={counting}
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
