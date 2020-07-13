import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

import InputItem from "./InputItem";

import { categories } from "../../dev/DevData";


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
  },
}));

export default function InputLayout(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const years = [...Array(100)].map((_, b)=> String(new Date().getFullYear() - b));
  years.push('Unknown');

  function handleClick(event) {
    switch (event.currentTarget.id) {
      case "name":
      case "subcategory":
        props.setEditRoute({
          route: "EDIT_TEXT",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "category":
        props.setEditRoute({
          route: "EDIT_LIST",
          field: event.currentTarget.id,
          data: categories,
        });
        break;
      case "year":
        props.setEditRoute({
          route: "EDIT_LIST",
          field: event.currentTarget.id,
          data: years,
        });
        break;
      case "origin":
        props.setEditRoute({
          route: "EDIT_ORIGIN",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      default:
        return event;
    }
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.handlePrevious}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Tea
          </Typography>
          <Button color="inherit" disabled>
            ADD
          </Button>
        </Toolbar>
      </AppBar>
      <FormGroup>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            Required
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
          <InputItem
            key="name"
            name="name"
            value={props.data.name}
            handleClick={handleClick}
          />
          <InputItem
            key="category"
            name="category"
            value={props.data.category}
            handleClick={handleClick}
          />
        </List>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            Optional
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
          <InputItem
            key="origin"
            name="origin"
            value={
              props.data.origin &&
                Object.values(props.data.origin).join(', ').replace('&#39;', "\'")
            }
            handleClick={handleClick}
          />
          {Object.entries(props.data).map(
            ([key, value]) =>
              !["name", "category", "origin"].includes(key) && (
                <InputItem
                  key={key}
                  name={key}
                  value={value}
                  handleClick={handleClick}
                />
              )
          )}
        </List>
      </FormGroup>
    </Box>
  );
}
