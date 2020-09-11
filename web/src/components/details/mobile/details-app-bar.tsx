import React, { ReactElement } from "react";
import { Box, IconButton, Toolbar } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import GenericAppBar from "../../generics/generic-app-bar";
import ActionIcons from "../../generics/action-icons";
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

  /** Routes back to main */
  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  return (
    <GenericAppBar>
      <Toolbar>
        <Box className={detailsClasses.grow}>
          <IconButton onClick={handleBack} edge="start" aria-label="back">
            <ArrowBack />
          </IconButton>
        </Box>
        <ActionIcons teaData={teaData} setRoute={setRoute} />
      </Toolbar>
    </GenericAppBar>
  );
}

export default DetailsAppbar;
