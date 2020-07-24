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

export default function EditYear(props) {
  const classes = useStyles();

  const length = 60;
  const currentYear = new Date().getFullYear();
  const years = [...Array(length)].map((_, b) => String(currentYear - b));
  years.push("Unknown");

  const checkboxList = years.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {});

  function handleChange(event) {
    props.setTeaData({ ...props.teaData, [props.field]: event.target.name });
    props.handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={props.handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Select {props.field}
          </Typography>
        </Toolbar>
      </AppBar>
      <CheckboxList
        label=""
        list={checkboxList}
        handleChange={(e) => handleChange(e)}
        reverse={true}
      />
      {[0, 10, 20, 30, 40].map((tens) => (
        <CheckboxListItem
          key={String(currentYear - length - tens)}
          name={String(currentYear - length - tens)}
          checked={false}
          handleChange={handleChange}
        />
      ))}
    </Box>
  );
}
