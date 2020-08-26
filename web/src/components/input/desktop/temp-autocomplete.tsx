import React, {ReactElement} from 'react';
import { Autocomplete } from "@material-ui/lab";
import { celsiusToFahrenheit } from "../../../services/parsing-services";
import {TextField} from '@material-ui/core';
import {FormikProps} from 'formik';
import {TeaRequest} from '../../../services/models';
import {InputFormData} from './input-form';
import {useStyles} from '../../../style/DesktopFormStyles';

/**
 * Desktop tea creation form temperature autocomplete component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param renderInput {component} Input component
 * @param fahrenheit {boolean} Use fahrenheit or celsius
 * @param brewing {string} Selected brewing: gongfu_brewing or western_brewing
 */
function TempAutocomplete(
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


  const options = [...Array(100)]
    .map((_, b) => String(values[values.brewing + "_fahrenheit"] ? celsiusToFahrenheit(b) : b))
    .reverse();

  function handleOnChange(newValue: string): void {
      setFieldValue(values.brewing + ".temperature", newValue);

  }

  return (
    <Autocomplete
      onChange={(_, value) => value && handleOnChange(value)}
      onInputChange={(_, value) => value && handleOnChange(value)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="temperature"
      options={options}
      freeSolo
      value={
        values[values.brewing]?.temperature ? String(values[values.brewing]?.temperature) : ""
      }
      getOptionLabel={(option) => {
        return option;
      }}
      renderOption={(option) => (option)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Temperature"
          aria-label="temperature"
          variant="outlined"
          size="small"
          className={classes.temperature}
          onChange={handleChange}
          onBlur={handleBlur}
          error={!!(
            errors[values.brewing + ".temperature"] &&
            touched[values.brewing + ".temperature"]
          )}
          helperText={
            touched[values.brewing + ".temperature"] &&
            errors[values.brewing + ".temperature"]
          }
        />
      )}
    />
  );
}

export default TempAutocomplete;
