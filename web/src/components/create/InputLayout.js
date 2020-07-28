import React, { useContext } from "react";
import {
  Box,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./InputAppBar";
import InputItem from "./InputItem";
import InputBrewing from "./InputBrewing";
import {
  cropToNoZeroes,
  getSubcategoryName,
} from "../../services/ParsingService";
import { getOriginName } from "../../services/ParsingService";
import { CategoriesState } from "../statecontainers/CategoriesContext";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  nameBox: {
    width: theme.spacing(13),
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
    <>
      <InputAppBar
        handleBackToLayout={handlePrevious}
        name="Tea"
        showAdd={true}
        disableAdd={!teaData.name || !teaData.category}
        handleAdd={handleAdd}
      />
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
          <ListItem className={formListClasses.listItem} id="gongfu">
            <Box className={formListClasses.listItemBox}>
              <Box className={classes.nameBox}>
                <Typography variant={"body2"}>Gongfu</Typography>
              </Box>
              <InputBrewing
                key="gongfu"
                name="gongfu"
                handleClick={handleClick}
                teaData={teaData}
              />
            </Box>
          </ListItem>
          <ListItem className={formListClasses.listItem} id="western">
            <Box className={formListClasses.listItemBox}>
              <Box className={classes.nameBox}>
                <Typography variant={"body2"}>Western</Typography>
              </Box>
              <InputBrewing
                key="western"
                name="western"
                handleClick={handleClick}
                teaData={teaData}
              />
            </Box>
          </ListItem>
        </List>
      </FormGroup>
    </>
  );
}
