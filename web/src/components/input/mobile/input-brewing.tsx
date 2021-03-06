import React, { MouseEvent, ReactElement } from "react";
import { Box, Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import {
  celsiusToFahrenheit,
  parseHMSToSeconds,
} from "../../../services/parsing-services";
import { TeaRequest } from "../../../services/models";

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

/**
 * InputBrewing props.
 *
 * @memberOf InputBrewing
 */
type Props = {
  /** Brewing type */
  name: "gongfu" | "western";
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Handles input item click */
  handleClick?: (event: MouseEvent) => void;
};

/**
 * Mobile tea editing layout list brewing item.
 *
 * @component
 * @subcategory Mobile input
 */
function InputBrewing({ name, teaData, handleClick }: Props): ReactElement {
  const classes = useStyles();

  function parseBrewingTimeTop(time: string): string {
    let seconds = parseHMSToSeconds(time);
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

  function parseBrewingTimeBottom(time: string): string {
    let seconds = parseHMSToSeconds(time);
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
          {teaData[name + "_brewing"]?.temperature &&
            teaData[name + "_brewing"]?.temperature + "°c"}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"]?.temperature &&
            celsiusToFahrenheit(teaData[name + "_brewing"].temperature) + "F"}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_weight"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"]?.weight &&
            teaData[name + "_brewing"].weight + "g"}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"]?.weight &&
            "/100ml"}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_initial"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"]?.initial &&
            parseBrewingTimeTop(teaData[name + "_brewing"].initial)}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"]?.initial &&
            parseBrewingTimeBottom(teaData[name + "_brewing"].initial)}
        </Typography>
      </Box>
      <Box
        className={classes.brewingButtonBox}
        id={name + "_increments"}
        onClick={handleClick}
      >
        <Typography variant="body2" className={classes.brewingButtonBoxText}>
          {teaData[name + "_brewing"]?.increments &&
            "+" + parseBrewingTimeTop(teaData[name + "_brewing"].increments)}
        </Typography>
        <Typography
          variant="body2"
          className={classes.brewingButtonBoxTextSmall}
        >
          {teaData[name + "_brewing"]?.increments &&
            parseBrewingTimeBottom(teaData[name + "_brewing"].increments)}
        </Typography>
      </Box>
    </Box>
  );
}

export default InputBrewing;
