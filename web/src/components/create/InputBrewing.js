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
              /100ml
            </Typography>
          </Box>
          <Box className={classes.brewingButtonBox} id={props.name + "_initial"} onClick={props.handleClick}>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].initial}
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              sec
            </Typography>
          </Box>
          <Box className={classes.brewingButtonBox} id={props.name + "_increments"} onClick={props.handleClick}>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxText}
            >
              {props.teaData[props.name + "_brewing"] &&
                props.teaData[props.name + "_brewing"].increments &&
                  "+" + props.teaData[props.name + "_brewing"].increments}
            </Typography>
            <Typography
              variant="body2"
              className={classes.brewingButtonBoxTextSmall}
            >
              sec
            </Typography>
          </Box>
        </Box>
      </Box>
    </ListItem>
  );
}
