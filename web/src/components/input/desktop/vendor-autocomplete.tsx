import React, { ChangeEvent, ReactElement, useContext } from "react";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { VendorsState } from "../../statecontainers/vendors-context";
import { Grid, TextField, Typography } from "@material-ui/core";
import { FormikProps } from "formik";
import { InputFormModel, VendorModel } from "../../../services/models";
import { FilterOptionsState } from "@material-ui/lab";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

const filter = createFilterOptions({
  stringify: (option: VendorModel) => option.name + " " + option.website,
});

type Option =
  | {
      inputValue: string;
      label: string;
    }
  | VendorModel;

/**
 * VendorAutocomplete props.
 *
 * @memberOf VendorAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Desktop tea editing form vendor autocomplete component.
 *
 * @component
 * @subcategory Desktop input
 */
function VendorAutocomplete({ formikProps }: Props): ReactElement {
  const {
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  const vendors = useContext(VendorsState);

  /**
   * Updates vendor form field.
   *
   * @param {string} name - Vendor name
   */
  function updateVendor(name: string): void {
    if (name) {
      // If input already exist add the object, otherwise add only the name
      const match = Object.entries(vendors).find(
        (entry) => entry[1].name === name
      );
      if (match) setFieldValue("vendor", match[1]);
      else setFieldValue("vendor", { name: name });
    } else setFieldValue("vendor", {});
  }

  /**
   * Calls Formik ChangeEvent handler and parses value
   * before updating vendor form field.
   *
   * @param {ChangeEvent<any>} event - onChange event
   * @param {Option|string|null} value - Input value
   */
  function handleOnChange(
    event: ChangeEvent<any>,
    value: Option | string | null
  ): void {
    if (event) {
      event.target.name = "vendor";
      handleChange(event);
    }
    if (value) {
      if (typeof value === "string") {
        updateVendor(value);
      } else if ("inputValue" in value) {
        // Create a new value from the user input
        updateVendor(value.inputValue);
      } else if ("name" in value) {
        setFieldValue("vendor", value);
      }
    }
  }

  return (
    <Autocomplete
      id="vendor"
      onChange={(event, value) => handleOnChange(event, value)}
      filterOptions={(
        options: Option[],
        params: FilterOptionsState<Option>
      ): Option[] => {
        const filtered: Option[] = filter(vendors, params);
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
      options={vendors ? vendors : []}
      getOptionLabel={(option: Option | string) => {
        if (typeof option === "string") return option;
        if ("inputValue" in option) return option.inputValue;
        else return option.name;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Vendor"
          aria-label="vendor"
          variant="outlined"
          inputProps={{ ...params.inputProps, maxLength: 50 }}
          size="small"
          className={classes.vendor}
          fullWidth
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(touched.vendor && errors.vendor)}
          helperText={touched.vendor && errors.vendor}
        />
      )}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs className={classes.listItem}>
              <span className={classes.listItemName}>
                {"inputValue" in option ? option.label : option.name}
              </span>
              <Typography variant="body2" color="textSecondary">
                {"website" in option ? option.website : ""}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default VendorAutocomplete;
