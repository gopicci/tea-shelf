import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
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
import emptyImage from "../../dev/empty.png";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
  gridCard: {
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
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listImage: {
    minWidth: theme.spacing(10),
    minHeight: "100px",
    objectFit: "cover",
    margin: theme.spacing(2),
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
    paddingLeft: 0,
    paddingBottom: theme.spacing(1),
  },
  topBox: {
    flexGrow: 1,
  },
  subcategory: {
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
    setRoute({route: "TEA_DETAILS", data: tea});
  }

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
      >
        <CardMedia
          className={gridView ? classes.gridImage : classes.listImage}
          alt="Tea image"
          image={tea.image ? tea.image : emptyImage}
          title="Tea image"
        />
        <CardContent className={classes.content}>
          <Box className={classes.topBox}>
            <Typography gutterBottom variant="h5" component="h2">
              {tea.name}
            </Typography>
            <Typography
              className={classes.subcategory}
              gutterBottom
              variant="subtitle1"
              component="h5"
            >
              {tea.year} {getSubcategoryName(tea.subcategory)}
            </Typography>
          </Box>
          <Box className={classes.bottomBox}>
            <StarRate className={classes.icon} />
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
                  className={classes.countryFlag}
                  countryCode={getCountryCode(tea.origin.country)}
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
