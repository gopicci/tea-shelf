import React, { ReactElement } from "react";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { FormikProps } from "formik";
import { InputFormModel } from "../../../services/models";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

/**
 * WeightAutocomplete props.
 *
 * @memberOf WeightAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Brewing weight autocomplete component, part of desktop tea editing form.
 * Shows different weight options based on brewing form value.
 *
 * @component
 * @subcategory Desktop input
 */
function WeightAutocomplete({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  const max = values.brewing === "gongfu_brewing" ? 10 : 2;
  const increment = values.brewing === "gongfu_brewing" ? 0.5 : 0.1;
  const options = [...Array(max / increment + 1)]
    .map((_, b) => (b * increment).toFixed(1))
    .reverse();

  /**
   * Sets brewing weight field value.
   *
   * @param {string|null} value - Weight input value
   */
  function handleOnChange(value: string | null): void {
    setFieldValue(values.brewing + ".weight", value ? value : "");
  }

  return (
    <Autocomplete
      id={values.brewing + ".weight"}
      onChange={(_, value) => handleOnChange(value)}
      onInputChange={(_, value) => handleOnChange(value)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      options={options}
      value={
        values[values.brewing]?.weight
          ? String(values[values.brewing]?.weight)
          : ""
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Grams per 100ml"
          aria-label={values.brewing + "_weight"}
          variant="outlined"
          size="small"
          className={classes.brewingWeight}
          onChange={handleChange}
          onBlur={handleBlur}
          error={
            !!(
              touched[values.brewing]?.weight && errors[values.brewing]?.weight
            )
          }
          helperText={
            touched[values.brewing]?.weight && errors[values.brewing]?.weight
          }
        />
      )}
    />
  );
}

export default WeightAutocomplete;
