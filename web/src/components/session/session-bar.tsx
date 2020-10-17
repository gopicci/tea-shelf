import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";
import MobileBar from "../generics/mobile-bar";
import { Route } from "../../app";

/**
 * SessionBar props.
 *
 * @memberOf SessionBar
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile session bar component, routes to custom session creation.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionBar({ setRoute }: Props): ReactElement {
  /** Sets main route to filter */
  function handleButtonClick(): void {
    setRoute({ route: "CREATE_SESSION" });
  }

  return (
    <MobileBar>
      <Button
        size="small"
        color="primary"
        disableElevation
        onClick={handleButtonClick}
      >
        Custom Brewing
      </Button>
    </MobileBar>
  );
}

export default SessionBar;
