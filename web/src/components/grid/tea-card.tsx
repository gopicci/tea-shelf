import React, { ReactElement, useContext } from "react";
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
  getCategoryName,
} from "../../services/parsing-services";
import { gridStyles } from "../../style/grid-styles";
import { CategoriesState } from "../statecontainers/categories-context";
import { Route } from "../../app";
import { TeaInstance } from "../../services/models";
import emptyImage from "../../media/empty.png";

/**
 * TeaCard props.
 *
 * @memberOf TeaCard
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
 * @subcategory Grid
 */
function TeaCard({ teaData, gridView, setRoute }: Props): ReactElement {
  const classes = gridStyles();

  const categories = useContext(CategoriesState);

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "TEA_DETAILS", teaPayload: teaData });
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
              {!teaData.subcategory
                ? getCategoryName(categories, teaData.category)
                : gridView
                ? teaData.subcategory.name
                : getSubcategoryName(teaData.subcategory)}
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
