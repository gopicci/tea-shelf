import React from "react";
import { Box, ListItem, Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

import { celsiusToFahrenheit } from "../../services/ParsingService";

const useStyles = makeStyles((theme) => ({
  nameBox: {
    width: theme.spacing(13),
  },
  valueBox: {
    flexGrow: 1,
    display: "flex",
  },
  brewingButtonBox: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    borderRadius: theme.spacing(3),
    marginTop: -theme.spacing(1.5),
    marginBottom: -theme.spacing(1.5),
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: fade("#dadfe5", 0.3),
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(1),
    cursor: "pointer",
    textTransform: "none",
  },
  brewingButtonBoxText: {
    margin: "auto",
  },
  brewingButtonBoxTextSmall: {
    margin: "auto",
    fontSize: 10,
  },
}));

export default function InputBrewing(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  function parseBrewingTimeTop(seconds) {
    if (!seconds) return "";
    if (seconds <= 60)
      return seconds.toString()
    else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      if (seconds % 60 === 0)
        return minutes.toString()
      else
        return minutes.toString() + "m"
    }
    else {
      const hours = Math.floor(seconds / 3600)
      if (seconds % 3600 === 0 || seconds > 18000)
        return hours.toString()
      else
        return hours.toString() + "h"
    }
  }

  function parseBrewingTimeBottom(seconds) {
    if (!seconds) return "";
    if (seconds <= 60)
      return "sec"
    else if (seconds < 3600) {
      const remainderSeconds = seconds % 60
      if (remainderSeconds > 0)
        return remainderSeconds.toString() + "sec"
      else return "min"
    }
    else {
      const remainderMinutes = Math.floor((seconds % 3600) / 60)
      if (remainderMinutes > 0 && seconds < 18000)
        return remainderMinutes.toString() + "min"
      else return "hour"
    }
  }

  return (
    <ListItem className={formListClasses.listItem} id={props.name}>
      <Box className={formListClasses.listItemBox}>
        <Box className={classes.nameBox}>
          <Typography variant={"body2"}>{props.name}</Typography>
        </Box>
        <Box className={classes.valueBox}>
          <Box
            className={classes.brewingButtonBox}
            id={props.name + "_temperature"}
            onClick={props.handleClick}
          >
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].temperature &&
                  props.teaData[props.name + "_brewing"].temperature + "°c"}
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].temperature &&
                  celsiusToFahrenheit(props.teaData[props.name + "_brewing"].temperature) +
                    "F"}
            </Typography>
          </Box>
          <Box className={classes.brewingButtonBox} id={props.name + "_weight"} onClick={props.handleClick}>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].weight &&
                  props.teaData[props.name + "_brewing"].weight + "g"}
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].weight &&
                "/100ml"
              }
            </Typography>
          </Box>
          <Box className={classes.brewingButtonBox} id={props.name + "_initial"} onClick={props.handleClick}>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                  parseBrewingTimeTop(props.teaData[props.name + "_brewing"].initial)
              }
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              {props.teaData[props.name + "_brewing"] &&
                  parseBrewingTimeBottom(props.teaData[props.name + "_brewing"].initial)
              }
            </Typography>
          </Box>
          <Box className={classes.brewingButtonBox} id={props.name + "_increments"} onClick={props.handleClick}>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].increments &&
                  "+" + parseBrewingTimeTop(props.teaData[props.name + "_brewing"].increments)}
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              {props.teaData[props.name + "_brewing"] &&
                parseBrewingTimeBottom(props.teaData[props.name + "_brewing"].increments)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
