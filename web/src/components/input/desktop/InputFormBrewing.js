import React from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import TempAutocomplete from "./TempAutocomplete";
import WeightAutocomplete from "./WeightAutocomplete";
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from "../../../services/parsing-services";

/**
 * Desktop tea creation form brewing component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param brewing {string} Selected brewing: gongfu_brewing or western_brewing
 * @param classes {Object} Form makeStyle classes
 * @param errors {Object} Formik errors
 * @param touched {Object} Formik touched
 * @param handleChange {function} Formik change handler
 * @param handleBlur {function} Formik blur handler
 */
export default function InputFormBrewing({
  teaData,
  setTeaData,
  brewing,
  classes,
  errors,
  touched,
  handleChange,
  handleBlur,
}) {
  return (
    <>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TempAutocomplete
            name="temperature"
            teaData={teaData}
            setTeaData={setTeaData}
            fahrenheit={teaData[brewing].fahrenheit}
            brewing={brewing}
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
                error={
                  errors[brewing] &&
                  touched[brewing] &&
                  errors[brewing].temperature &&
                  touched[brewing].temperature
                }
                helperText={
                  errors[brewing] &&
                  touched[brewing] &&
                  errors[brewing].temperature &&
                  touched[brewing].temperature &&
                  errors[brewing].temperature
                }
              />
            )}
          />
          <FormControl
            className={classes.degrees}
            variant="outlined"
            size="small"
          >
            <Select
              name="degrees"
              aria-label="degrees"
              value={teaData[brewing].fahrenheit ? "fahrenheit" : "celsius"}
              onChange={(e) => {
                handleChange(e);
                const fahrenheit = e.target.value === "fahrenheit";
                let temp = teaData[brewing].temperature;
                if (temp)
                  if (fahrenheit) temp = celsiusToFahrenheit(temp);
                  else temp = fahrenheitToCelsius(temp);
                setTeaData({
                  ...teaData,
                  [brewing]: {
                    ...teaData[brewing],
                    fahrenheit: fahrenheit,
                    temperature: temp,
                  },
                });
              }}
              onBlur={handleBlur}
            >
              <MenuItem value="celsius">°C</MenuItem>
              <MenuItem value="fahrenheit">F</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <WeightAutocomplete
          name="brewingWeight"
          teaData={teaData}
          setTeaData={setTeaData}
          brewing={brewing}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Grams per 100ml"
              aria-label="brewing_weight"
              variant="outlined"
              size="small"
              className={classes.brewingWeight}
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                errors[brewing] &&
                touched[brewing] &&
                errors[brewing].weight &&
                touched[brewing].weight
              }
              helperText={
                errors[brewing] &&
                touched[brewing] &&
                errors[brewing].weight &&
                touched[brewing].weight &&
                errors[brewing].weight
              }
            />
          )}
        />
      </Box>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TextField
            name="initial"
            label="Initial time"
            aria-label="initial"
            inputProps={{ maxLength: 8 }}
            size="small"
            variant="outlined"
            value={teaData[brewing].initial ? teaData[brewing].initial : "00:00:00"}
            className={classes.initial}
            onChange={(e) => {
              handleChange(e);
              setTeaData({
                ...teaData,
                [brewing]: {
                  ...teaData[brewing],
                  initial: e.target.value,
                },
              });
            }}
            onBlur={handleBlur}
            error={
              errors[brewing] &&
              touched[brewing] &&
              errors[brewing].initial &&
              touched[brewing].initial
            }
            helperText={
              errors[brewing] &&
              touched[brewing] &&
              errors[brewing].initial &&
              touched[brewing].initial &&
              errors[brewing].initial
            }
          />
        </Box>
        <Box className={classes.justifyRight}>
          <TextField
            name="increments"
            label="Increments"
            aria-label="increments"
            inputProps={{ maxLength: 8 }}
            size="small"
            variant="outlined"
            value={
              teaData[brewing].increments ? teaData[brewing].increments : "00:00:00"
            }
            className={classes.increments}
            onChange={(e) => {
              handleChange(e);
              setTeaData({
                ...teaData,
                [brewing]: {
                  ...teaData[brewing],
                  increments: e.target.value,
                },
              });
            }}
            onBlur={handleBlur}
            error={
              errors[brewing] &&
              touched[brewing] &&
              errors[brewing].increments &&
              touched[brewing].increments
            }
            helperText={
              errors[brewing] &&
              touched[brewing] &&
              errors[brewing].increments &&
              touched[brewing].increments &&
              errors[brewing].increments
            }
          />
        </Box>
      </Box>
    </>
  );
}
