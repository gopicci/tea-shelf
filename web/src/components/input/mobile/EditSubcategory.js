import React, { useState, useContext } from "react";
import {
  InputAdornment,
  TextField,
  Typography,
  Box,
  IconButton,
  FormGroup,
  FormLabel,
  List,
  ListItem,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { ArrowBack } from "@material-ui/icons";
import {
  brewingTimesToSeconds,
  getSubcategoryName,
} from "../../../services/ParsingService";
import { SubcategoriesState } from "../../statecontainers/SubcategoriesContext";
import { formListStyles } from "../../../style/FormListStyles";

const filter = createFilterOptions();

/**
 * Mobile tea creation subcategory input component. Shows a list and autocomplete from
 * central subcategories state, with option to add extra.
 * Updates category entry if different than ones in matching subcategory.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditSubcategory({
  teaData,
  setTeaData,
  handleBackToLayout,
}) {
  const formListClasses = formListStyles();

  const subcategories = useContext(SubcategoriesState);

  const [inputValue, setInputValue] = useState("");

  const options = Object.entries(subcategories).map((entry) => {
    return getSubcategoryName(entry[1]);
  });

  function updateSubcategory(name) {
    // Look for a match in subcategories central state
    const match = Object.entries(subcategories).find((entry) => {
      const lcName = name.toLowerCase();
      if (getSubcategoryName(entry[1]).toLowerCase() === lcName) return true;
      if (entry[1].name.toLowerCase() === lcName) return true;
      return entry[1].translated_name.toLowerCase() === lcName;
    });
    if (match) {
      const subcategory = match[1];
      // Match found, update also category, origin and brewings
      let data = {
        ...teaData,
        subcategory: subcategory,
        category: subcategory.category,
      };
      if (subcategory.origin)
        data = {
          ...data,
          origin: subcategory.origin,
        };
      if (subcategory.western_brewing)
        data = {
          ...data,
          western_brewing: brewingTimesToSeconds(subcategory.western_brewing),
        };
      if (subcategory.gongfu_brewing)
        data = {
          ...data,
          gongfu_brewing: brewingTimesToSeconds(subcategory.gongfu_brewing),
        };
      console.log(data)
      setTeaData(data);
    } else setTeaData({ ...teaData, subcategory: { name: name } });
    handleBackToLayout();
  }

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      updateSubcategory(newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      updateSubcategory(newValue.inputValue);
    } else {
      updateSubcategory(newValue);
    }
  }

  return (
    <>
      {options && (
        <Autocomplete
          onChange={handleOnChange}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);

            // Suggest the creation of a new value
            if (params.inputValue !== "") {
              filtered.push({
                inputValue: params.inputValue,
                label: `Add "${params.inputValue}"`,
              });
            }

            return filtered;
          }}
          open={inputValue !== ""}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="subcategory-autocomplete"
          options={options}
          getOptionLabel={(option) => {
            // Value selected with enter, right from the input
            if (typeof option === "string") {
              return option;
            }
            // Add "xxx" option created dynamically
            if (option.inputValue) {
              return option.inputValue;
            }
            // Regular option
            return option;
          }}
          renderOption={(option) => (option.inputValue ? option.label : option)}
          freeSolo
          ListboxProps={{ style: { maxHeight: "60vh" } }}
          PaperComponent={({ children }) => <Box>{children}</Box>}
          renderInput={(params) => (
            <TextField
              {...params}
              className={formListClasses.textField}
              variant="outlined"
              placeholder="Search subcategory"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={handleBackToLayout}
                      edge="start"
                      color="inherit"
                      aria-label="back"
                    >
                      <ArrowBack />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}
      {!inputValue && (
        <FormGroup>
          <FormLabel className={formListClasses.formLabel}>
            <Typography className={formListClasses.formLabelText}>
              Popular subcategories
            </Typography>
          </FormLabel>
          <List className={formListClasses.list}>
            {options &&
              options.map((option) => (
                <ListItem
                  button
                  className={formListClasses.listItem}
                  key={option}
                  id={option}
                  aria-label={option}
                  onClick={(e) => updateSubcategory(e.currentTarget.id)}
                >
                  <Box className={formListClasses.listItemBox}>
                    <Typography variant={"body2"}>{option}</Typography>
                  </Box>
                </ListItem>
              ))}
          </List>
        </FormGroup>
      )}
    </>
  );
}
