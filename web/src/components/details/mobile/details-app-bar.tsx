import React, { ReactElement } from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  useScrollTrigger,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import ActionIcons from "../../generics/actionIcons";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { Route } from "../../../app";
import { TeaInstance } from "../../../services/models";

/**
 * DetailsAppbar props.
 *
 * @memberOf DetailsAppbar
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile tea details app bar.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsAppbar({ teaData, setRoute }: Props): ReactElement {
  const detailsClasses = mobileDetailsStyles();

  const shadowTrigger = useScrollTrigger({
    threshold: 1,
    disableHysteresis: true,
  });

  /** Routes back to main */
  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  return (
    <AppBar
      position="fixed"
      elevation={shadowTrigger ? 3 : 0}
      style={{ border: 0 }}
    >
      <Toolbar>
        <Box className={detailsClasses.grow}>
          <IconButton
            onClick={handleBack}
            edge="start"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
        </Box>
        <ActionIcons teaData={teaData} setRoute={setRoute} />
      </Toolbar>
    </AppBar>
  );
}

export default DetailsAppbar;
