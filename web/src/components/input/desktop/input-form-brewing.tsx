import React, {ReactElement, useState} from 'react';
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import TempAutocomplete from "./temp-autocomplete";
import WeightAutocomplete from "./WeightAutocomplete";
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from "../../../services/parsing-services";
import {useStyles} from '../../../style/DesktopFormStyles';
import {FormikProps} from 'formik';
import {TeaRequest} from '../../../services/models';
import {InputFormData} from './input-form';

type Props = {
    brewing: string;
}

/**
 * Desktop tea creation form brewing component.
 *
 * @component
 * @subcategory Desktop input
 */
function InputFormBrewing(formikProps: FormikProps<InputFormData>): ReactElement {
  const {values, handleChange, handleBlur, errors, touched, setFieldValue} = formikProps;
  const classes = useStyles();


  return (
    <>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TempAutocomplete
            {...formikProps}
          />
          <FormControl
            className={classes.degrees}
            variant="outlined"
            size="small"
          >
            <Select
              name="degrees"
              aria-label="degrees"
              value={values[values.brewing].fahrenheit ? "fahrenheit" : "celsius"}
              onChange={(e) => {
                handleChange(e);
                const fahrenheit = e.target.value === "fahrenheit";
                let temp = values[values.brewing]?.temperature;
                if (temp)
                  if (fahrenheit) temp = celsiusToFahrenheit(temp);
                  else temp = fahrenheitToCelsius(temp);
                setFieldValue(values.brewing + ".temperature", temp);
                setFieldValue(values.brewing + ".fahrenheit", e.target.value === "fahrenheit");
                console.log(e.target.value, values)
              }}
              onBlur={handleBlur}
            >
              <MenuItem value="celsius">°C</MenuItem>
              <MenuItem value="fahrenheit">F</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}

export default InputFormBrewing;
