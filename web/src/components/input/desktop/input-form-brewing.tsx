import React, { ReactElement } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { FormikProps } from "formik";
import TempAutocomplete from "./temp-autocomplete";
import WeightAutocomplete from "./weight-autocomplete";
import { InputFormModel } from "../../../services/models";
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from "../../../services/parsing-services";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

/**
 * InputFormBrewing props.
 *
 * @memberOf InputFormBrewing
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Desktop tea editing form brewing component. Groups inputs related
 * to BrewingModel and gets used for both brewing types.
 *
 * @component
 * @subcategory Desktop input
 */
function InputFormBrewing({ formikProps }: Props): ReactElement {
  const {
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue,
  } = formikProps;
  const classes = desktopFormStyles();

  return (
    <>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TempAutocomplete formikProps={formikProps} />
          <FormControl
            className={classes.degrees}
            variant="outlined"
            size="small"
          >
            <Select
              name="degrees"
              aria-label="degrees"
              value={
                values[values.brewing].fahrenheit ? "fahrenheit" : "celsius"
              }
              onChange={(e) => {
                handleChange(e);
                const fahrenheit = e.target.value === "fahrenheit";
                let temp = values[values.brewing]?.temperature;
                if (temp)
                  if (fahrenheit) temp = celsiusToFahrenheit(temp);
                  else temp = fahrenheitToCelsius(temp);
                setFieldValue(values.brewing + ".temperature", temp);
                setFieldValue(
                  values.brewing + ".fahrenheit",
                  e.target.value === "fahrenheit"
                );
                console.log(e.target.value, values);
              }}
              onBlur={handleBlur}
            >
              <MenuItem value="celsius">°C</MenuItem>
              <MenuItem value="fahrenheit">F</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <WeightAutocomplete formikProps={formikProps} />
      </Box>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TextField
            name={values.brewing + ".initial"}
            label="Initial time"
            aria-label={values.brewing + "_initial"}
            inputProps={{ maxLength: 8 }}
            size="small"
            variant="outlined"
            value={
              values[values.brewing]?.initial
                ? String(values[values.brewing]?.initial)
                : "00:00:00"
            }
            className={classes.initial}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              !!(
                touched[values.brewing]?.initial &&
                errors[values.brewing]?.initial
              )
            }
            helperText={
              touched[values.brewing]?.initial &&
              errors[values.brewing]?.initial
            }
          />
        </Box>
        <Box className={classes.justifyRight}>
          <TextField
            name={values.brewing + ".increments"}
            label="Increments"
            aria-label={values.brewing + "increments"}
            inputProps={{ maxLength: 8 }}
            size="small"
            variant="outlined"
            value={
              values[values.brewing]?.increments
                ? String(values[values.brewing]?.increments)
                : "00:00:00"
            }
            className={classes.increments}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              !!(
                touched[values.brewing]?.increments &&
                errors[values.brewing]?.increments
              )
            }
            helperText={
              touched[values.brewing]?.increments &&
              errors[values.brewing]?.increments
            }
          />
        </Box>
      </Box>
    </>
  );
}

export default InputFormBrewing;
