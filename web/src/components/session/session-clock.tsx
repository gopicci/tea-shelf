import React, {ReactElement, useRef} from 'react';
import Countdown from "react-countdown";
import { getEndDate } from "../../services/parsing-services";
import { Clock, SessionInstance } from "../../services/models";

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
  /** Clock state */
  clock?: Clock;
  /** Handles countdown completion */
  handleComplete: () => void;
};

/**
 * Brewing session countdown clock.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionClock({
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
  );
}

export default SessionClock;
