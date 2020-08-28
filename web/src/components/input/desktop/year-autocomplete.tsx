import React, { ChangeEvent, ReactElement } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { FormikProps } from "formik";
import { InputFormModel } from "../../../services/models";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

const currentYear = new Date().getFullYear();
const yearOptionsLength = 60;
export const yearOptions = [...Array(yearOptionsLength)].map((_, b) =>
  String(currentYear - b)
);
yearOptions.unshift("Unknown");

/**
 * YearAutocomplete props.
 *
 * @memberOf YearAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Desktop tea editing form year autocomplete component.
 *
 * @component
 * @subcategory Desktop input
 */
function YearAutocomplete({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  /**
   * Calls Formik ChangeEvent handler and sets year field value.
   *
   * @param {ChangeEvent<any>} event - onChange event
   * @param {string} value - Input value
   */
  function handleOnChange(event: ChangeEvent<any>, value: string | null) {
    if (event) {
      event.target.name = "year";
      handleChange(event);
    }
    setFieldValue("year", value ? value : "");
  }

  return (
    <Autocomplete
      id="year"
      onChange={(event, value) => handleOnChange(event, value)}
      onInputChange={(event, value) => handleOnChange(event, value)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={yearOptions}
      freeSolo
      value={values.year ? String(values.year) : ""}
      renderInput={(params) => (
        <TextField
          {...params}
          name="year"
          label="Year"
          aria-label="year"
          variant="outlined"
          size="small"
          className={classes.year}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(touched.year && errors.year)}
          helperText={touched.year && errors.year}
        />
      )}
    />
  );
}

export default YearAutocomplete;
