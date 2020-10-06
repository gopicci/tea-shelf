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
import { SessionInstance, TeaInstance } from "../../services/models";

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
 * DateCard props.
 *
 * @memberOf DateCard
 * @subcategory Main
 */
type Props = {
  /** Date object */
  date: Date;
  /** Grid or list mode */
  gridView: boolean;
};

/**
 * Card component visualizing a date.
 *
 * @component
 * @subcategory Main
 */
function DateCard({ date, gridView }: Props): ReactElement {
  const classes = useStyles();

  return (
    <Card variant="outlined">
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
      >
        <CardContent className={classes.content}>
          <Typography gutterBottom variant="h5">
            {date.toLocaleString("en-US", { month: "long", year: "numeric" })}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default DateCard;
