import React, { MouseEvent, ReactElement, useContext } from "react";
import {
  Box,
  FormGroup,
  FormLabel,
  List,
  ListItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./input-app-bar";
import InputItem from "./input-item";
import InputBrewing from "./input-brewing";
import {
  cropToNoZeroes,
  getCategoryName,
  getSubcategoryName,
} from "../../../services/parsing-services";
import { getOriginName } from "../../../services/parsing-services";
import { CategoriesState } from "../../statecontainers/categories-context";
import { formListStyles } from "../../../style/form-list-styles";
import { TeaRequest } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  nameBox: {
    width: theme.spacing(13),
  },
}));

/**
 * InputLayout props.
 *
 * @memberOf InputLayout
 */
type Props = {
  /** Instance tea data state for initial values on edit mode */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Save callback from MobileInput */
  handleSave: () => void;
  /** Routes to previous stage */
  handlePrevious: () => void;
  /** Sets edit route based in InputRouter routing table */
  setEditRoute: (route: string) => void;
};

/**
 * Defines mobile tea creation input stage layout.
 *
 * @component
 * @subcategory Mobile input
 */
function InputLayout({
  teaData,
  setTeaData,
  handleSave,
  handlePrevious,
  setEditRoute,
}: Props): ReactElement {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const categories = useContext(CategoriesState);

  /**
   * Routes to edit component on input item click.
   *
   * @param {MouseEvent} event - Mouse click event
   */
  function handleClick(event: MouseEvent): void {
    setEditRoute(event.currentTarget.id);
  }

  /**
   * Removes input item data on clear icon click.
   *
   * @param {MouseEvent} event - Mouse click event
   */
  function handleClear(event: MouseEvent): void {
    let item = event.currentTarget.id;
    if (item === "weight") item = "weight_left";
    setTeaData({ ...teaData, [item]: undefined });
  }

  return (
    <>
      <InputAppBar
        handleBackToLayout={handlePrevious}
        name="Tea"
        actionName={teaData.offline_id ? "Edit" : "Add"}
        saveName={teaData.offline_id ? "Save" : "Create"}
        disableSave={!teaData.name || !teaData.category}
        handleSave={handleSave}
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
            value={teaData.name ? teaData.name : ""}
            handleClick={handleClick}
          />
          <InputItem
            key="category"
            name="category"
            value={
              categories && teaData.category
                ? getCategoryName(categories, teaData.category).toLowerCase()
                : ""
            }
            handleClick={handleClick}
            noBorder
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
              teaData.subcategory?.name
                ? getSubcategoryName(teaData.subcategory)
                : ""
            }
            handleClick={handleClick}
            handleClear={handleClear}
          />
          <InputItem
            key="year"
            name="year"
            value={teaData.year ? String(teaData.year) : ""}
            handleClick={handleClick}
            handleClear={handleClear}
          />
          <InputItem
            key="origin"
            name="origin"
            value={
              teaData.origin?.country
                ? getOriginName(teaData.origin).replace("&#39;", "'")
                : ""
            }
            handleClick={handleClick}
            handleClear={handleClear}
          />
          <InputItem
            key="vendor"
            name="vendor"
            value={teaData.vendor?.name ? teaData.vendor.name : ""}
            handleClick={handleClick}
            handleClear={handleClear}
          />
          <InputItem
            key="weight"
            name="weight"
            value={
              teaData.weight_left
                ? cropToNoZeroes(teaData.weight_left) +
                  "g - " +
                  cropToNoZeroes(teaData.weight_left / 28.35, 2) +
                  "oz"
                : ""
            }
            handleClick={handleClick}
            handleClear={handleClear}
          />
          <InputItem
            key="price"
            name="price"
            value={
              teaData.price
                ? cropToNoZeroes(teaData.price, 2) +
                  "/g - " +
                  cropToNoZeroes(teaData.price * 28.35, 1) +
                  "/oz"
                : ""
            }
            handleClick={handleClick}
            handleClear={handleClear}
            noTitle
            noBorder
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
            <Box className={formListClasses.listItemBox} style={{ border: 0 }}>
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

export default InputLayout;
