import React, { ReactElement } from "react";
import { Dialog } from "@material-ui/core";
//import Edit from "../Edit";
import Create from "../create";
import { Route } from "../../app";

/**
 * DialogLayout props.
 *
 * @memberOf DialogLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Desktop dialog component, used for creating and editing teas,
 * as well as visualizing tea instances details (through Edit component).
 *
 * @component
 * @subcategory Main
 */
function DialogLayout(props: Props): ReactElement {
  const { route, setRoute } = props;

  /** Sets route to main closing the dialog */
  function handleClose(): void {
    setRoute({ route: "MAIN" });
  }

  return (
    <Dialog
      fullWidth
      maxWidth={route.route === "TEA_DETAILS" ? "md" : "sm"}
      open={true}
      onClose={handleClose}
    >
      {route.route === "CREATE" && <Create {...props} />}
    </Dialog>
  );
}

export default DialogLayout;
