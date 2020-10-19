import React, { ReactElement, useState } from "react";
import { Dialog } from "@material-ui/core";
import CreateTea from "../create-tea";
import InputForm from "../input/desktop/input-form";
import DesktopDetailsLayout from "../details/desktop/desktop-details-layout";
import Settings from "../settings";
import ConfirmationLayout from "./confirmation-layout";
import SessionForm from "../input/desktop/session-form";
import SessionLayout from "../session/session-layout";
import { Route } from "../../app";
import { Confirmation } from "../../services/models";

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
 * Generic desktop dialog component, used for creating and editing teas,
 * visualizing tea instances details and confirmation purposes.
 *
 * @component
 * @subcategory Main
 */
function DialogLayout(props: Props): ReactElement {
  const { route, setRoute } = props;

  const [confirmation, setConfirmation] = useState<Confirmation | undefined>(
    undefined
  );

  /** Sets route closing the dialog */
  function handleClose(): void {
    if (confirmation)
      setRoute({ route: "CONFIRMATION", confirmation: confirmation });
    else if (["CREATE_SESSION", "SESSION_DETAILS"].includes(route.route))
      setRoute({ route: "SESSIONS" });
    else setRoute({ route: "MAIN" });
  }

  return (
    <Dialog
      disableBackdropClick={route.route === "CONFIRMATION"}
      disableEscapeKeyDown={route.route === "CONFIRMATION"}
      fullWidth
      maxWidth={route.route === "TEA_DETAILS" ? "md" : "sm"}
      open={true}
      onClose={handleClose}
    >
      {route.route === "CREATE_TEA" && <CreateTea {...props} />}
      {route.route === "EDIT_TEA" && <InputForm {...props} />}
      {route.route === "TEA_DETAILS" && (
        <DesktopDetailsLayout
          {...props}
          setConfirmation={setConfirmation}
          handleClose={handleClose}
        />
      )}
      {route.route === "CREATE_SESSION" && <SessionForm {...props} />}
      {route.route === "SESSION_DETAILS" && (
        <SessionLayout {...props} handleClose={handleClose} />
      )}
      {route.route === "SETTINGS" && <Settings {...props} />}
      {route.route === "CONFIRMATION" && <ConfirmationLayout {...props} />}
    </Dialog>
  );
}

export default DialogLayout;
