import React from "react";
import { Box, Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { celsiusToFahrenheit } from "../../../services/ParsingService";

const useStyles = makeStyles((theme) => ({
  root: {
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

export default function InputBrewing({ name, teaData, handleClick }) {
  /**
   * Mobile tea creation layout list brewing item.
   *
   * @param name {string} Item name
   * @param teaData {json} Input tea data state
   * @param handleClick {function} Handles item click
   */

  const classes = useStyles();

  function convertToSeconds(time) {
    const s = String(time);
    if (s.includes(":")) {
      // Input is API format dd hh:mm:ss
      let days = 0;
      if (s.includes(" ")) days = parseInt(s.slice(0, 2));
      const a = s.slice(-8).split(":");
      return parseInt(days * 24 * 3600 + +a[0] * 3600 + +a[1] * 60 + +a[2]);
    } else return parseInt(time);
  }

  function parseBrewingTimeTop(time) {
    let seconds = convertToSeconds(time);
    if (!seconds) return "";
    if (seconds <= 60) return seconds.toString();
    else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      if (seconds % 60 === 0) return minutes.toString();
      else return minutes.toString() + "m";
    } else {
      const hours = Math.floor(seconds / 3600);
      if (seconds % 3600 === 0 || seconds > 18000) return hours.toString();
      else return hours.toString() + "h";
    }
  }

  function parseBrewingTimeBottom(time) {
    let seconds = convertToSeconds(time);
    if (!seconds) return "";
    if (seconds <= 60) return "sec";
    else if (seconds < 3600) {
      const remainderSeconds = seconds % 60;
      if (remainderSeconds > 0) return remainderSeconds.toString() + "sec";
      else return "min";
    } else {
      const remainderMinutes = Math.floor((seconds % 3600) / 60);
      if (remainderMinutes > 0 && seconds < 18000)
        return remainderMinutes.toString() + "min";
      else return "hour";
    }
  }

  return (
    <Box className={classes.root}>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_temperature"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"] &&
            teaData[name + "_brewing"].temperature &&
            teaData[name + "_brewing"].temperature + "°c"}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"] &&
            teaData[name + "_brewing"].temperature &&
            celsiusToFahrenheit(teaData[name + "_brewing"].temperature) + "F"}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_weight"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"] &&
            teaData[name + "_brewing"].weight &&
            teaData[name + "_brewing"].weight + "g"}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"] &&
            teaData[name + "_brewing"].weight &&
            "/100ml"}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_initial"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"] &&
            parseBrewingTimeTop(teaData[name + "_brewing"].initial)}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"] &&
            parseBrewingTimeBottom(teaData[name + "_brewing"].initial)}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_increments"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"] &&
            teaData[name + "_brewing"].increments &&
            "+" + parseBrewingTimeTop(teaData[name + "_brewing"].increments)}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"] &&
            parseBrewingTimeBottom(teaData[name + "_brewing"].increments)}
        </Typography>
      </Box>
    </Box>
  );
}
