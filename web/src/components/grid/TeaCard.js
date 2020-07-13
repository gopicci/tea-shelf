import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";

import {CategoriesState} from "../containers/CategoriesStateContainer";

const useStyles = makeStyles((theme) => ({
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
    height: 200,
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
    width: `calc(200px - ${theme.spacing(4)}px)`,
    height: `calc(200px - ${theme.spacing(4)}px)`,
    margin: theme.spacing(2),
    borderRadius: 4,
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  content: {
    minHeight: 100,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
  },
  infoBox: {
    flexGrow: 1,
  },
  subcategory: {
    fontStyle: "italic",
  },
  category: {
    marginTop: theme.spacing(4),
    textAlign: "right",
  },
}));

export default function TeaCard({ tea, gridView }) {
  const classes = useStyles();

  const categories = useContext(CategoriesState);

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
      >
        <CardMedia
          className={gridView ? classes.gridImage : classes.listImage}
          alt="Tea image"
          image={tea.image}
          title="Tea image"
        />
        <CardContent className={classes.content}>
          <Box className={classes.infoBox}>
            <Typography gutterBottom variant="h5" component="h2">
              {tea.name}
            </Typography>
            <Typography
              className={classes.subcategory}
              gutterBottom
              variant="subtitle1"
              component="h5"
            >
              {tea.year} {tea.subcategory}
            </Typography>
          </Box>
          <Box className={classes.category}>
            <Typography variant="body2" component="span">
              {categories &&
                Object.entries(categories).find(
                  (entry) => entry[1].id === tea.category
                )[1].name}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
