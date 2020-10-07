import React, { ReactElement } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FormikProps } from "formik";
import { celsiusToFahrenheit } from "../../../services/parsing-services";
import { desktopFormStyles } from "../../../style/desktop-form-styles";
import { InputFormModel } from "../../../services/models";

/**
 * TempAutocomplete props.
 *
 * @memberOf TempAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Brewing temperature autocomplete component, part of desktop tea editing form.
 * Shows different temperature options based on measure form value.
 *
 * @component
 * @subcategory Desktop input
 */
function TempAutocomplete({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  const options = [...Array(100)]
    .map((_, b) =>
      String(values[values.brewing_type]?.fahrenheit ? celsiusToFahrenheit(b) : b)
    )
    .reverse();

  /**
   * Sets brewing temperature field value.
   *
   * @param {string|null} value - Temperature input value
   */
  function handleOnChange(value: string | null): void {
    setFieldValue(values.brewing + ".temperature", value);
  }

  return (
    <Autocomplete
      id={values.brewing + ".temperature"}
      onChange={(_, value) => handleOnChange(value)}
      onInputChange={(_, value) => handleOnChange(value)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      freeSolo
      value={
        values[values.brewing_type]?.temperature
          ? String(values[values.brewing_type]?.temperature)
          : ""
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Temperature"
          aria-label={values.brewing + "_temperature"}
          variant="outlined"
          size="small"
          className={classes.temperature}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            !!(
              touched[values.brewing_type]?.temperature &&
              errors[values.brewing_type]?.temperature
            )
          }
          helperText={
            touched[values.brewing_type]?.temperature &&
            errors[values.brewing_type]?.temperature
          }
        />
      )}
    />
  );
}

export default TempAutocomplete;
