import React, { ReactElement } from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import dateFormat from "dateformat";
import { gridStyles } from "../../style/grid-styles";
import { Route } from "../../app";
import { SessionInstance, TeaInstance } from "../../services/models";

/**
 * SessionCard props.
 *
 * @memberOf SessionCard
 * @subcategory Main
 */
type Props = {
  /** Session instance data */
  sessionData: SessionInstance;
  /** Optional sssion tea instance data */
  teaData?: TeaInstance;
  /** Grid or list mode */
  gridView: boolean;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Card component visualizing a single tea instance.
 *
 * @component
 * @subcategory Main
 */
function SessionCard({
  sessionData,
  teaData,
  gridView,
  setRoute,
}: Props): ReactElement {
  const classes = gridStyles();

  /** Sets main route to tea details */
  function handleCardClick(): void {
    //setRoute({ route: "SESSION_DETAILS", sessionPayload: sessionData });
  }

  const started = new Date(sessionData.created_on);

  return (
    <Card variant="outlined">
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
      >
        <CardContent className={classes.content}>
          <Box className={classes.rowSpace}>
            <Typography gutterBottom variant="caption">
              {gridView
                ? dateFormat(started, "ddd dS")
                : dateFormat(started, "dddd dS")}
            </Typography>
            <Typography gutterBottom variant="caption">
              {dateFormat(started, "h:MM TT")}
            </Typography>
          </Box>
          <Typography gutterBottom variant="h5" className={classes.centerContent}>
            {teaData?.name}
          </Typography>
          <Box className={classes.bottomBox}>
            <Typography variant="caption">
              Infusions: {sessionData.current_infusion}
            </Typography>
          </Box>
        </CardContent>
        {sessionData.is_completed && <Box className={classes.disabledCard} />}
      </CardActionArea>
    </Card>
  );
}

export default SessionCard;
