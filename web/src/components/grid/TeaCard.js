import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Typography,
} from "@material-ui/core";
import { StarRate, MoreVert } from "@material-ui/icons";
import ReactCountryFlag from "react-country-flag";
import {
  getOriginShortName,
  getSubcategoryName,
  getCountryCode,
} from "../../services/ParsingService";
import { CategoriesState } from "../statecontainers/CategoriesContext";
import emptyImage from "../../empty.png";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
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
    color: "#ccc",
  },
  cardActions: {
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  category: {
    flexGrow: 1,
  },
}));

export default function TeaCard({ tea, gridView, setRoute }) {
  /**
   * Card component visualizing a single tea instance.
   *
   * @param tea {json} Tea instance data in API format
   * @param gridView {bool} Grid view switch status
   */

  const classes = useStyles();

  const categories = useContext(CategoriesState);

  function handleCardClick() {
    setRoute({ route: "TEA_DETAILS", data: tea });
  }

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
        aria-label={tea.name}
      >
        <img
          className={gridView ? classes.gridImage : classes.listImage}
          alt=""
          src={tea.image ? tea.image : emptyImage}
          crossOrigin="anonymous"
        />
        <CardContent className={classes.content}>
          <Box className={classes.topBox}>
            <Typography gutterBottom variant="h5">
              {tea.name}
            </Typography>
            <Typography
              className={
                gridView ? classes.gridSubcategory : classes.listSubcategory
              }
              gutterBottom
              variant="subtitle1"
            >
              {tea.year} {getSubcategoryName(tea.subcategory)}
            </Typography>
          </Box>
          <Box className={classes.bottomBox}>
            {tea.rating > 0 && (
              <Box className={classes.ratingBox}>
                <StarRate className={classes.icon} />
                <Typography
                  className={classes.rating}
                  variant="body2"
                  component="span"
                >
                  {tea.rating / 2}
                </Typography>
              </Box>
            )}
            {tea.origin && (
              <>
                <Typography
                  className={classes.origin}
                  variant="body2"
                  component="span"
                >
                  {getOriginShortName(tea.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  className={classes.countryFlag}
                  style={{
                    width: "1.5em",
                    height: "1.5em",
                  }}
                  countryCode={getCountryCode(tea.origin.country)}
                  alt=""
                  aria-label={tea.origin.country}
                />
                <ReactCountryFlag
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  className={classes.countryFlag}
                  countryCode={getCountryCode(tea.origin.country)}
                  alt=""
                  aria-label={tea.origin.country}
                />
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Typography
          className={classes.category}
          variant="body2"
          component="span"
        >
          {categories &&
            Object.entries(categories).find(
              (entry) => entry[1].id === tea.category
            )[1].name}
        </Typography>
        <MoreVert className={classes.icon} />
      </CardActions>
    </Card>
  );
}
