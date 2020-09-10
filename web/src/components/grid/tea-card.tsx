import React, { ReactElement } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { StarRate } from "@material-ui/icons";
import ReactCountryFlag from "react-country-flag";
import {
  getOriginShortName,
  getSubcategoryName,
  getCountryCode,
} from "../../services/parsing-services";
import { Route } from "../../app";
import { TeaInstance } from "../../services/models";
import emptyImage from "../../media/empty.png";

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
 * TeaCard props.
 *
 * @memberOf TeaCard
 * @subcategory Main
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
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
function TeaCard({ teaData, gridView, setRoute }: Props): ReactElement {
  const classes = useStyles();

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "TEA_DETAILS", payload: teaData });
  }

  return (
    <Card variant="outlined">
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
        aria-label={teaData.name}
      >
        <img
          className={gridView ? classes.gridImage : classes.listImage}
          alt=""
          src={teaData.image ? teaData.image : emptyImage}
          crossOrigin="anonymous"
        />
        <CardContent className={classes.content}>
          <Box className={classes.topBox}>
            <Typography gutterBottom variant="h5">
              {teaData.name}
            </Typography>
            <Typography
              className={
                gridView ? classes.gridSubcategory : classes.listSubcategory
              }
              gutterBottom
              variant="subtitle1"
            >
              {teaData.year}{" "}
              {teaData.subcategory && getSubcategoryName(teaData.subcategory)}
            </Typography>
          </Box>
          <Box className={classes.bottomBox}>
            {teaData.rating !== undefined && teaData.rating > 0 && (
              <Box className={classes.ratingBox}>
                <StarRate className={classes.icon} />
                <Typography
                  className={classes.rating}
                  variant="body2"
                  component="span"
                >
                  {teaData.rating / 2}
                </Typography>
              </Box>
            )}
            {teaData.origin && (
              <>
                <Typography
                  className={classes.origin}
                  variant="body2"
                  component="span"
                >
                  {getOriginShortName(teaData.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  className={classes.countryFlag}
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                  countryCode={getCountryCode(teaData.origin.country)}
                  alt=""
                  aria-label={teaData.origin.country}
                />
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default TeaCard;
