import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import InputItem from "./InputItem";
import { celsiusToFahrenheit } from "../../services/ParsingService";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

export default function EditTemperature({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation brewing temperature input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();
  const formListClasses = formListStyles();

  const degrees = [...Array(100)].map((_, b) => String(b)).reverse();

  function handleClick(degree) {
    if (field === "gongfu_temperature")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          temperature: degree,
        },
      });
    if (field === "western_temperature")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          temperature: degree,
        },
      });
    handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Select temperature
          </Typography>
        </Toolbar>
      </AppBar>
      <List className={formListClasses.list}>
        {degrees.map((d) => (
          <InputItem
            key={d}
            name={d + "°c"}
            value={celsiusToFahrenheit(d) + "F"}
            handleClick={() => handleClick(d)}
          />
        ))}
      </List>
    </Box>
  );
}
