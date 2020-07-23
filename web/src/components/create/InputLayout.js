import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Button,
  FormGroup,
  FormLabel,
  IconButton,
  List, ListItem,
  Link,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { ArrowBack, RadioButtonUnchecked } from "@material-ui/icons";
import { makeStyles, fade } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

import InputItem from "./InputItem";
import { getSubcategoryName } from "../../services/ParsingService";
import { getOriginName } from "../../services/ParsingService";
import { getYearsList } from '../../services/ParsingService';

import { CategoriesState } from "../statecontainers/CategoriesContext";

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

export default function InputLayout(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const categories = useContext(CategoriesState)

  function handleAdd() {
    props.handleCreate();
    props.handleClose();
  }

  function handleClick(event) {
    switch (event.currentTarget.id) {
      case "name":
        props.setEditRoute({
          route: "EDIT_TEXT",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "category":
        props.setEditRoute({
          route: "EDIT_CATEGORY",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "subcategory":
      props.setEditRoute({
        route: "EDIT_SUBCATEGORY",
        field: event.currentTarget.id,
        data: null,
      });
      break;
      case "year":
        props.setEditRoute({
          route: "EDIT_LIST",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "origin":
        props.setEditRoute({
          route: "EDIT_ORIGIN",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "vendor":
        props.setEditRoute({
          route: "EDIT_VENDOR",
          field: event.currentTarget.id,
          data: null,
        });
        break;
      case "gongfu_temperature":
        props.setEditRoute({
          route: "EDIT_TEMPERATURE",
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
          <Button
            color="inherit"
            disabled={!props.teaData.name || !props.teaData.category}
            onClick={handleAdd}
          >
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
            value={props.teaData.name}
            handleClick={handleClick}
          />
          <InputItem
            key="category"
            name="category"
            value={
              categories &&
              props.teaData.category &&
              Object.entries(categories)
                .find((entry) => entry[1].id === props.teaData.category)[1]
                .name.toLowerCase()
            }
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
            key="subcategory"
            name="subcategory"
            value={
              props.teaData.subcategory &&
              getSubcategoryName(props.teaData.subcategory)
            }
            handleClick={handleClick}
          />
          <InputItem
            key="year"
            name="year"
            value={props.teaData.year}
            handleClick={handleClick}
          />
          <InputItem
            key="origin"
            name="origin"
            value={
              props.teaData.origin &&
              getOriginName(props.teaData.origin).replace("&#39;", "'")
            }
            handleClick={handleClick}
          />
          <InputItem
            key="vendor"
            name="vendor"
            value={
              props.teaData.vendor &&
              props.teaData.vendor.name
            }
            handleClick={handleClick}
          />
        </List>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            Brewing instructions
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
          <ListItem
            className={formListClasses.listItem}
            key="gongfu"
            id="gongfu"
          >
            <Box className={formListClasses.listItemBox}>
              <Box className={classes.nameBox}>
                <Typography variant={"body2"}>gongfu</Typography>
              </Box>
              <Box className={classes.valueBox}>
                <Box className={classes.brewingButtonBox} onClick={handleClick}>
                  <Typography variant="body2" className={classes.brewingButtonBoxText}>95°c</Typography>
                  <Typography variant="body2" className={classes.brewingButtonBoxTextSmall}>205F</Typography>
                </Box>
                <Box className={classes.brewingButtonBox} onClick={handleClick}>
                  <Typography variant="body2" className={classes.brewingButtonBoxText}>5g</Typography>
                  <Typography variant="body2" className={classes.brewingButtonBoxTextSmall}>/100ml</Typography>
                </Box>
                <Box className={classes.brewingButtonBox} onClick={handleClick}>
                  <Typography variant="body2" className={classes.brewingButtonBoxText}>20</Typography>
                  <Typography variant="body2" className={classes.brewingButtonBoxTextSmall}>sec</Typography>
                </Box>
                <Box className={classes.brewingButtonBox} onClick={handleClick}>
                  <Typography variant="body2" className={classes.brewingButtonBoxText}>+5</Typography>
                  <Typography variant="body2" className={classes.brewingButtonBoxTextSmall}>sec</Typography>
                </Box>
              </Box>
            </Box>
          </ListItem>
          <InputItem
            key="western"
            name="western"
            value={props.teaData.western_brewing}
            handleClick={handleClick}
          />
        </List>
      </FormGroup>
    </Box>
  );
}
