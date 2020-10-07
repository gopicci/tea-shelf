import React, { ChangeEvent, ReactElement, useContext } from "react";
import { TextField } from "@material-ui/core";
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { FilterOptionsState } from "@material-ui/lab";
import { FormikProps } from "formik";
import { getSubcategoryName } from "../../../services/parsing-services";
import { SessionFormModel, TeaInstance } from "../../../services/models";
import { TeasState } from "../../statecontainers/tea-context";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

type Option = { inputValue: string; label: string } | string;

const filter = createFilterOptions<Option>();

/**
 * TeaAutocomplete props.
 *
 * @memberOf TeaAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<SessionFormModel>;
};

/**
 * Desktop session editing form tea autocomplete component.
 * Modifies brewing fields with tea related data.
 *
 * @component
 * @subcategory Desktop input
 */
function TeaAutocomplete({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  const teas = useContext(TeasState);

  const options = Object.entries(teas)
    .map(([_, tea]) => {
      return tea.name;
    })
    .sort();

  /**
   * Updates form values with tea data.
   *
   * @param {string} name - Tea input name
   */
  function updateTea(name: string): void {
    if (name) {
      // Look for a match in teas global state
      const match = Object.entries(teas).find(([_, entry]) => {
        return entry.name.toLowerCase() === name.toLowerCase();
      });
      if (match) {
        // Match found, update tea field
        const tea: TeaInstance = match[1];
        setFieldValue("tea", tea);

        // Update brewings if present
        if (tea.western_brewing)
          setFieldValue("western_brewing", {
            ...tea.western_brewing,
            fahrenheit: values.western_brewing.fahrenheit,
          });
        if (tea.gongfu_brewing)
          setFieldValue("gongfu_brewing", {
            ...tea.gongfu_brewing,
            fahrenheit: values.western_brewing.fahrenheit,
          });
      } else {
        // No match found, add new
        setFieldValue("tea", { name: name });
      }
    } else setFieldValue("tea", {});
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
      event.target.name = "tea";
      handleChange(event);
    }
    if (typeof value === "string") {
      updateTea(value);
    } else if (value?.inputValue) {
      // Create a new value from the user input
      updateTea(value.inputValue);
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
        values.tea
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
          name="tea"
          label="Tea"
          aria-label="tea"
          className={classes.name}
          fullWidth
          variant="outlined"
          size="small"
          inputProps={{ ...params.inputProps, maxLength: 50 }}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(touched.tea && errors.tea)}
          helperText={touched.tea && errors.tea}
        />
      )}
    />
  );
}

export default TeaAutocomplete;
