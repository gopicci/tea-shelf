import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./InputAppBar";
import CheckboxList from "../generics/CheckboxList";
import { brewingTimesToSeconds } from "../../services/ParsingService";
import { CategoriesState } from "../statecontainers/CategoriesContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

export default function EditCategory({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation category list input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();

  const categories = useContext(CategoriesState);

  function handleChange(event) {
    console.log(categories);
    for (const entry of Object.entries(categories))
      if (entry[1].name.toLowerCase() === event.target.name.toLowerCase())
        setTeaData({
          ...teaData,
          [field]: entry[1].id,
          subcategory: null,
          gongfu_brewing: brewingTimesToSeconds(entry[1].gongfu_brewing),
          western_brewing: brewingTimesToSeconds(entry[1].western_brewing),
        });
    handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={field} />
      {categories && (
        <CheckboxList
          label=""
          list={Object.entries(categories)
            .map((entry) => entry[1].name)
            .reduce((obj, item) => {
              obj[item.toLowerCase()] = false;
              return obj;
            }, {})}
          handleChange={(e) => handleChange(e)}
          reverse={field === "year"}
        />
      )}
    </Box>
  );
}
