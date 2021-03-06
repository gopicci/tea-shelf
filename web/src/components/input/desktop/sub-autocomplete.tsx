import React, { ChangeEvent, ReactElement, useContext } from "react";
import { TextField } from "@material-ui/core";
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { FilterOptionsState } from "@material-ui/lab";
import { FormikProps } from "formik";
import { getSubcategoryName } from "../../../services/parsing-services";
import { InputFormModel } from "../../../services/models";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { CategoriesState } from "../../statecontainers/categories-context";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

type Option = { inputValue: string; label: string } | string;

const filter = createFilterOptions<Option>();

/**
 * SubAutocomplete props.
 *
 * @memberOf SubAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Desktop tea editing form subcategory autocomplete component.
 * Modifies form fields with subcategory related data.
 *
 * @component
 * @subcategory Desktop input
 */
function SubAutocomplete({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  const subcategories = useContext(SubcategoriesState);
  const categories = useContext(CategoriesState);

  const options = Object.entries(subcategories)
    .map((entry) => {
      return getSubcategoryName(entry[1]);
    })
    .sort();

  /**
   * Updates form values with subcategory data.
   *
   * @param {string} name - Subcategory input name
   */
  function updateSubcategory(name: string): void {
    if (name) {
      // Look for a match in subcategories global state
      const subcategory = Object.values(subcategories).find((sub) => {
        const lcName = name.toLowerCase();
        if (getSubcategoryName(sub).toLowerCase() === lcName) return true;
        if (sub.name.toLowerCase() === lcName) return true;
        return sub.translated_name?.toLowerCase() === lcName;
      });
      if (subcategory) {
        // Match found, update subcategory field
        setFieldValue("subcategory", subcategory);

        // Update category field if present
        if (subcategory.category) {
          const category = Object.values(categories).find(
            (c) => c.id === subcategory.category
          );
          if (category) {
            setFieldValue("category", category.id);
            setFieldValue("western_brewing", {
              ...category.western_brewing,
              fahrenheit: false,
            });
            setFieldValue("gongfu_brewing", {
              ...category.gongfu_brewing,
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

  /**
   * Calls Formik ChangeEvent handler and parses value
   * before updating subcategory related form fields.
   *
   * @param {ChangeEvent<any>} event - onChange event
   * @param {Option|null} value - Input value
   */
  function handleOnChange(event: ChangeEvent<any>, value: Option | null): void {
    if (event) {
      event.target.name = "subcategory";
      handleChange(event);
    }
    if (typeof value === "string") {
      updateSubcategory(value);
    } else if (value?.inputValue) {
      // Create a new value from the user input
      updateSubcategory(value.inputValue);
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
      freeSolo
      value={
        values.subcategory?.name ? getSubcategoryName(values.subcategory) : ""
      }
      options={options ? options : []}
      getOptionLabel={(option: Option): string => {
        if (typeof option === "string") return option;
        if (option.inputValue) return option.inputValue;
        return String(option);
      }}
      renderOption={(option: Option): string => {
        if (typeof option === "string") return option;
        if (option.label) return option.label;
        return String(option);
      }}
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
          helperText={touched.subcategory && errors.subcategory}
        />
      )}
    />
  );
}

export default SubAutocomplete;
