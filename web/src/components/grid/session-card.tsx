import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { Route } from "../../app";
import {SessionInstance, TeaInstance} from '../../services/models';

const useStyles = makeStyles((theme) => ({
  gridCard: {
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "stretch",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listCard: {
    display: "flex",
    justifyContent: "left",
    alignItems: "stretch",
    height: theme.spacing(16),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  gridImage: {
    height: 120,
    width: "100%",
    objectFit: "cover",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listImage: {
    width: theme.spacing(10),
    height: "100px",
    objectFit: "cover",
    margin: theme.spacing(2),
    marginRight: 0,
    borderRadius: 4,
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(1),
  },
  topBox: {
    flexGrow: 1,
  },
  gridSubcategory: {
    fontStyle: "italic",
    paddingBottom: theme.spacing(4),
  },
  listSubcategory: {
    fontStyle: "italic",
  },
  bottomBox: {
    display: "flex",
  },
  origin: {
    flexGrow: 1,
    margin: "auto",
    textAlign: "right",
  },
  ratingBox: {
    display: "flex",
    flexShrink: 1,
  },
  rating: {
    margin: "auto",
  },
  countryFlag: {
    fontSize: theme.typography.body2.fontSize,
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
  icon: {
    color: theme.palette.text.secondary,
  },
}));

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
function SessionCard({ sessionData, teaData, gridView, setRoute }: Props): ReactElement {
  const classes = useStyles();

  /** Sets main route to tea details */
  function handleCardClick(): void {
    //setRoute({ route: "SESSION_DETAILS", payload: sessionData });
  }

  const started = new Date(sessionData.created_on);

  const dateOptions = { weekday: 'long', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  console.log(sessionData);
  console.log(teaData);

  return (
    <Card variant="outlined">
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
      >
        <CardContent className={classes.content}>
          <Box className={classes.topBox}>
            <Typography gutterBottom variant="h5">
              {started.toLocaleString("en-US", dateOptions)}
            </Typography>
            <Typography gutterBottom variant="subtitle1">
              {teaData?.name}
            </Typography>
          </Box>
          <Box className={classes.bottomBox}>
            <Typography variant="body2">
              Current infusion: {sessionData.current_infusion}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default SessionCard;
