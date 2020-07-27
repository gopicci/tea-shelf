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
import { formListStyles } from "../../style/FormListStyles";
import { VendorsState } from "../statecontainers/VendorsContext";

const filter = createFilterOptions();

export default function EditVendor({
  teaData,
  setTeaData,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation vendor input component. Shows a list and autocomplete from
   * central vendors state, with option to add extra.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const formListClasses = formListStyles();

  const vendors = useContext(VendorsState);

  const [inputValue, setInputValue] = useState("");

  const options = Object.entries(vendors).map((entry) => {
    return entry[1].name;
  });

  function updateVendor(name) {
    // If input already exist add the object, otherwise add only the name
    const match = Object.entries(vendors).find(
      (entry) => entry[1].name === name
    );
    if (match) setTeaData({ ...teaData, vendor: match[1] });
    else setTeaData({ ...teaData, vendor: { name: name } });
    handleBackToLayout();
  }

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      updateVendor(newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      updateVendor(newValue.inputValue);
    } else {
      updateVendor(newValue);
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
          id="vendor-autocomplete"
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
              placeholder="Search vendor"
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
              Popular vendors
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
                  onClick={(e) => updateVendor(e.currentTarget.id)}
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
