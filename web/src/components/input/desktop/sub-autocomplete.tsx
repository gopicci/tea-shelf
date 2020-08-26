import React, {
  ChangeEvent,
  FocusEvent,
  ReactElement,
  useContext,
} from "react";
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { getSubcategoryName } from "../../../services/parsing-services";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { CategoriesState } from "../../statecontainers/categories-context";
import {
  TeaRequest,
  SubcategoryModel,
  CategoryModel,
} from "../../../services/models";
import { FilterOptionsState } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { useStyles } from "../../../style/DesktopFormStyles";
import { FormikProps } from "formik";
import { InputFormData } from "./input-form";

type Option =
  | {
      inputValue: string;
      label: string;
    }
  | string;

const filter = createFilterOptions<Option>();

/**
 * Desktop tea creation form subcategory autocomplete component.
 * Modifies other teaData status with subcategory related data.
 *
 * @component
 * @subcategory Desktop input
 */
function SubAutocomplete({
  values,
  setFieldValue,
  touched,
  errors,
  handleChange,
  handleBlur,
}: FormikProps<InputFormData>): ReactElement {
  const classes = useStyles();

  const subcategories = useContext(SubcategoriesState);
  const categories = useContext(CategoriesState);

  const options = Object.entries(subcategories)
    .map((entry) => {
      return getSubcategoryName(entry[1]);
    })
    .sort();

  function updateSubcategory(name: string): void {
    if (name) {
      // Look for a match in subcategories central state
      const match = Object.entries(subcategories).find((entry) => {
        const lcName = name.toLowerCase();
        if (getSubcategoryName(entry[1]).toLowerCase() === lcName) return true;
        if (entry[1].name.toLowerCase() === lcName) return true;
        return entry[1].translated_name?.toLowerCase() === lcName;
      });
      if (match) {
        // Match found, update subcategory field
        const subcategory: SubcategoryModel = match[1];
        setFieldValue("subcategory", subcategory);

        // Update category field if present
        if (subcategory.category) {
          const category = Object.entries(categories).find(
            (entry) => entry[1].id === subcategory.category
          );
          if (category) {
            setFieldValue("category", category[1].id);
            setFieldValue("western_brewing", {
              ...category[1].western_brewing,
              fahrenheit: false,
            });
            setFieldValue("gongfu_brewing", {
              ...category[1].gongfu_brewing,
              fahrenheit: false,
            });
          }
        }
        // Update origin and brewings if present
        if (subcategory.origin) setFieldValue("origin", subcategory.origin);
        if (subcategory.western_brewing)
          setFieldValue("western_brewing", {
            ...subcategory.western_brewing,
            fahrenheit: values.western_brewing.fahrenheit,
          });
        if (subcategory.gongfu_brewing)
          setFieldValue("gongfu_brewing", {
            ...subcategory.gongfu_brewing,
            fahrenheit: values.western_brewing.fahrenheit,
          });
      } else {
        // No match found, add new
        setFieldValue("subcategory", { name: name });
      }
    } else setFieldValue("subcategory", {});
  }

  function handleOnChange(
    event: ChangeEvent<any>,
    newValue: Option | null
  ): void {
    if (event) {
      event.target.name = "subcategory";
      handleChange(event);
    }
    if (typeof newValue === "string") {
      updateSubcategory(newValue);
    } else if (newValue?.inputValue) {
      // Create a new value from the user input
      updateSubcategory(newValue.inputValue);
    }
  }

  return (
    <Autocomplete
      id="subcategory"
      onChange={(event, value) => handleOnChange(event, value)}
      filterOptions={(
        options: Option[],
        params: FilterOptionsState<Option>
      ): Option[] => {
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
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      fullWidth
      options={options ? options : []}
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
      value={values.subcategory?.name ? values.subcategory?.name : ""}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          name="subcategory"
          label="Subcategory"
          aria-label="subcategory"
          className={classes.subcategory}
          fullWidth
          variant="outlined"
          size="small"
          inputProps={{ ...params.inputProps, maxLength: 50 }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(touched.subcategory && errors.subcategory)}
          helperText={
            errors.subcategory && touched.subcategory && errors.subcategory
          }
        />
      )}
    />
  );
}

export default SubAutocomplete;
