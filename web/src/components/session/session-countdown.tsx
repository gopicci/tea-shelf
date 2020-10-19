import React, { ReactElement, useRef } from "react";
import Countdown from "react-countdown";
import { getEndDate } from "../../services/parsing-services";
import { Clock, SessionInstance } from "../../services/models";

/**
 * Countdown props.
 *
 * @memberOf SessionCountdown
 */
type CountdownProps = {
  hours: number;
  minutes: number;
  seconds: number;
};

/**
 * SessionCountdown props.
 *
 * @memberOf SessionCountdown
 */
type Props = {
  /** Brewing session state */
  session: SessionInstance;
  /** Clock state */
  clock?: Clock;
  /** Handles countdown completion */
  handleComplete: () => void;
};

/**
 * Brewing session countdown. Uses Clock prop starting time if any, otherwise Date.now().
 * Shows time in H:MM:SS format with optional hours.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionCountdown({
  session,
  clock,
  handleComplete,
}: Props): ReactElement {
  const clockRef = useRef({} as Countdown);

  return (
    <Countdown
      key={getEndDate(clock ? clock.starting_time : Date.now(), session)}
      date={getEndDate(clock ? clock.starting_time : Date.now(), session)}
      ref={clockRef}
      autoStart={!!clock}
      renderer={({ hours, minutes, seconds }: CountdownProps): ReactElement => {
        return (
          <span>
            {hours > 0 && String(hours) + ":"}
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </span>
        );
      }}
      onComplete={handleComplete}
    />
  );
}

export default SessionCountdown;
