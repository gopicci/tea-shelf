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

import { categories } from "../../dev/DevData";

const categoriesList = categories.reduce((obj, item) => {
  obj[item.toLowerCase()] = false;
  return obj;
}, {});

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

export default function EditCategory(props) {
  const classes = useStyles();

  const handlePrevious = () => props.setEditRoute("INPUT_LIST");

  function handleChange(event) {
    props.setData({ ...props.data, [props.field]: event.target.name });
    handlePrevious();
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={handlePrevious}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
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
        list={categoriesList}
        handleChange={(e) => handleChange(e)}
      />
    </Box>
  );
}
