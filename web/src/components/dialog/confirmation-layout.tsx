import React, { ReactElement } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  Typography,
} from "@material-ui/core";
import { desktopDetailsStyles } from "../../style/desktop-details-styles";
import { Route } from "../../app";

/**
 * ConfirmationLayout props.
 *
 * @memberOf ConfirmationLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile tea details page layout.
 *
 * @component
 * @subcategory Main
 */
function ConfirmationLayout({ route, setRoute }: Props): ReactElement {
  const classes = desktopDetailsStyles();

  /** Routes to main. */
  function handleCancel(): void {
    setRoute({ route: "MAIN" });
  }

  /** Calls route callback. */
  function handleOk(): void {
    route.confirmation?.callback();
  }

  return (
    <>
      <DialogContent className={classes.messageBox}>
        <Typography variant="h5">{route.confirmation?.message}</Typography>
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </>
  );
}

export default ConfirmationLayout;
