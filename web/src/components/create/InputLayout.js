import React, { useContext } from "react";
import {
  AppBar,
  Box,
  Button,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

import { formListStyles } from "../../style/FormListStyles";

import InputItem from "./InputItem";
import InputBrewing from "./InputBrewing";
import {
  cropToNoZeroes,
  getSubcategoryName,
} from "../../services/ParsingService";
import { getOriginName } from "../../services/ParsingService";

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
}));

export default function InputLayout({
  teaData,
  handleCreate,
  handleClose,
  handlePrevious,
  setEditRoute,
}) {
  /**
   * Defines mobile tea creation input stage layout.
   *
   * @param teaData {json} Input tea data state
   * @param handleCreate {function} Handle tea posting process
   * @param handleClose {function} Cancel process and reroute to main route
   * @param handlePrevious {function} Go back to previous stage (captureImage)
   * @param setEditRoute {function} Reroutes to input item
   */

  const classes = useStyles();
  const formListClasses = formListStyles();

  const categories = useContext(CategoriesState);

  function handleAdd() {
    handleCreate();
    handleClose();
  }

  function handleClick(event) {
    setEditRoute(event.currentTarget.id);
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
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Tea
          </Typography>
          <Button
            color="inherit"
            disabled={!teaData.name || !teaData.category}
            onClick={handleAdd}
            aria-label="add"
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
            value={teaData.name}
            handleClick={handleClick}
          />
          <InputItem
            key="category"
            name="category"
            value={
              categories &&
              teaData.category &&
              Object.entries(categories)
                .find((entry) => entry[1].id === teaData.category)[1]
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
              teaData.subcategory && getSubcategoryName(teaData.subcategory)
            }
            handleClick={handleClick}
          />
          <InputItem
            key="year"
            name="year"
            value={teaData.year}
            handleClick={handleClick}
          />
          <InputItem
            key="origin"
            name="origin"
            value={
              teaData.origin &&
              getOriginName(teaData.origin).replace("&#39;", "'")
            }
            handleClick={handleClick}
          />
          <InputItem
            key="vendor"
            name="vendor"
            value={teaData.vendor && teaData.vendor.name}
            handleClick={handleClick}
          />
          <InputItem
            key="weight"
            name="weight"
            value={
              teaData.weight_left &&
              teaData.weight_left +
                "g - " +
                cropToNoZeroes(teaData.weight_left / 28.35, 2) +
                "oz"
            }
            handleClick={handleClick}
          />
          <InputItem
            key="price"
            name="price"
            value={
              teaData.price &&
              teaData.price +
                "/g - " +
                cropToNoZeroes(teaData.price * 28.35, 1) +
                "/oz"
            }
            handleClick={handleClick}
            noTitle={true}
          />
        </List>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            Brewing instructions
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
          <InputBrewing
            key="gongfu"
            name="gongfu"
            handleClick={handleClick}
            teaData={teaData}
          />
          <InputBrewing
            key="western"
            name="western"
            handleClick={handleClick}
            teaData={teaData}
          />
        </List>
      </FormGroup>
    </Box>
  );
}
