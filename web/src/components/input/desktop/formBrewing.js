import {
  Box,
  FormControl,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import TempAutocomplete from "./TempAutocomplete";
import WeightAutocomplete from "./WeightAutocomplete";
import React from "react";

export default function FormBrewing({
  teaData,
  setTeaData,
  brewing,
  classes,
  errors,
  touched,
  handleChange,
  handleBlur,
  values,
  setFieldValue,
}) {
  return (
    <>
      <Box className={classes.row}>
        <Box className={classes.justifyLeft}>
          <TempAutocomplete
            name="temperature"
            teaData={teaData}
            setTeaData={setTeaData}
            fahrenheit={values[brewing].fahrenheit}
            brewing={brewing}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Temperature"
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
              value={values[brewing].fahrenheit ? "fahrenheit" : "celsius"}
              onChange={(e) =>
                setFieldValue(brewing, {
                  ...values[brewing],
                  fahrenheit: e.target.value === "fahrenheit",
                })
              }
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
            inputProps={{ maxLength: 3 }}
            size="small"
            variant="outlined"
            value={teaData[brewing].initial ? teaData[brewing].initial : ""}
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
          <FormControl
            className={classes.initialMeasure}
            variant="outlined"
            size="small"
          >
            <Select
              name="initialMeasure"
              value={values[brewing].initialMeasure}
              onChange={(e) =>
                setFieldValue(brewing, {
                  ...values[brewing],
                  initialMeasure: e.target.value,
                })
              }
              onBlur={handleBlur}
            >
              <MenuItem value="s">s</MenuItem>
              <MenuItem value="m">m</MenuItem>
              <MenuItem value="h">h</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box className={classes.justifyRight}>
          <TextField
            name="increments"
            label="Increments"
            inputProps={{ maxLength: 3 }}
            size="small"
            variant="outlined"
            value={
              teaData[brewing].increments ? teaData[brewing].increments : ""
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
          <FormControl
            className={classes.incrementsMeasure}
            variant="outlined"
            size="small"
          >
            <Select
              name="incrementsMeasure"
              value={values[brewing].incrementsMeasure}
              onChange={(e) =>
                setFieldValue(brewing, {
                  ...values[brewing],
                  incrementsMeasure: e.target.value,
                })
              }
              onBlur={handleBlur}
            >
              <MenuItem value="s">s</MenuItem>
              <MenuItem value="m">m</MenuItem>
              <MenuItem value="h">h</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
}
