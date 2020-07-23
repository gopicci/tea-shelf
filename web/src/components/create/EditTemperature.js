import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import CheckboxList from "../generics/CheckboxList";
import CheckboxListItem from "../generics/CheckboxListItem";

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

export default function EditTemperature(props) {
  const classes = useStyles();

  const degrees = [...Array(100)].map((_, b) => String(b));
  const checkboxList = degrees.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {});

  function handleChange(event) {
    if (props.field === "gongfu_temperature")
    props.setTeaData({ ...props.teaData, gongfu_brewing: {temperature: event.target.name }});
    props.handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Select temperature
          </Typography>
        </Toolbar>
      </AppBar>
      <CheckboxList
        label=""
        list={checkboxList}
        handleChange={(e) => handleChange(e)}
        reverse={true}
      />
    </Box>
  );
}
