import React, { ChangeEvent, FocusEvent, ReactElement } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TeaRequest } from "../../../services/models";
import { FormikProps } from "formik";
import { TextField } from "@material-ui/core";
import { useStyles } from "../../../style/DesktopFormStyles";
import {InputFormData} from './input-form';

const currentYear = new Date().getFullYear();
const yearOptionsLength = 60;
export const yearOptions = [...Array(yearOptionsLength)].map((_, b) =>
    String(currentYear - b)
  );
  yearOptions.unshift("Unknown");


/**
 * Desktop tea creation form year autocomplete component.
 *
 * @component
 * @subcategory Desktop input
 */
function YearAutocomplete(
  {
    values,
    setFieldValue,
    touched,
    errors,
    handleChange,
    handleBlur,
  }: FormikProps<InputFormData>
): ReactElement {
  const classes = useStyles();

  function handleOnChange(event: ChangeEvent<any>, newValue: string | null) {
    if (event) {
      event.target.name = "year";
      handleChange(event);
    }
    setFieldValue("year", newValue ? newValue : "");
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
          error={!!(errors.year && touched.year)}
          helperText={errors.year && touched.year && errors.year}
        />
      )}
    />
  );
}

export default YearAutocomplete;
