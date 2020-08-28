import React, { useState, useContext, ReactElement } from "react";
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
import { getSubcategoryName } from "../../../services/parsing-services";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { formListStyles } from "../../../style/form-list-styles";
import { TeaRequest } from "../../../services/models";
import { FilterOptionsState } from "@material-ui/lab";

type Option = { inputValue: string; label: string } | string;

const filter = createFilterOptions<Option>();

/**
 * EditSubcategory props.
 *
 * @memberOf EditSubcategory
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
};

/**
 * Mobile tea creation subcategory input component. Shows a list and autocomplete from
 * central subcategories state, with option to add extra.
 * Updates category, origin and brewing entries to match subcategory data.
 *
 * @component
 * @subcategory Mobile input
 */
function EditSubcategory({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const formListClasses = formListStyles();

  const subcategories = useContext(SubcategoriesState);

  const [inputValue, setInputValue] = useState("");

  const options = Object.values(subcategories).map((subcategory) => {
    return getSubcategoryName(subcategory);
  });

  /**
   * Updates input state of subcategory and related
   * fields. Routes back to input layout.
   *
   * @param {string} name - Subcategory name
   */
  function updateSubcategory(name: string): void {
    // Look for a match in subcategories context
    const subcategory = Object.values(subcategories).find((value) => {
      const lcName = name.toLowerCase();
      if (getSubcategoryName(value).toLowerCase() === lcName) return true;
      if (value.name.toLowerCase() === lcName) return true;
      return value.translated_name?.toLowerCase() === lcName;
    });
    if (subcategory) {
      // Match found, update also category, origin and brewings
      let data = {
        ...teaData,
        subcategory: subcategory,
      };
      if (subcategory.category)
        data = {
          ...data,
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
          western_brewing: subcategory.western_brewing,
        };
      if (subcategory.gongfu_brewing)
        data = {
          ...data,
          gongfu_brewing: subcategory.gongfu_brewing,
        };
      setTeaData(data);
    } else setTeaData({ ...teaData, subcategory: { name: name } });
    handleBackToLayout();
  }

  /**
   * Parses input value before calling subcategory
   * update method.
   *
   * @param {Option} value - Input value
   */
  function handleOnChange(value: Option): void {
    if (typeof value === "string") {
      updateSubcategory(value);
    } else if (value && value.inputValue) {
      // Create a new value from the user input
      updateSubcategory(value.inputValue);
    }
  }

  return (
    <>
      {options && (
        <Autocomplete
          onChange={(_, value) => value && handleOnChange(value)}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          filterOptions={(
            options: Option[],
            params: FilterOptionsState<Option>
          ) => {
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
          getOptionLabel={(option: Option): string => {
            if (typeof option === "string") return option;
            if (option.inputValue) return option.inputValue;
            return String(option);
          }}
          renderOption={(option: Option) => {
            if (typeof option === "string") return option;
            if (option.label) return option.label;
            return String(option);
          }}
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

export default EditSubcategory;
