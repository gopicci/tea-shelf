import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./InputAppBar";

const useStyles = makeStyles((theme) => ({
  mainBox: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  radio: {
    marginTop: theme.spacing(2),
  },
}));

/**
 * Mobile tea creation brewing time list input component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditTime({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("seconds");

  const fields = field.split("_");

  function handleChange(event) {
    const onlyNumbers = event.target.value.replace(/[^0-9]/g, "");
    setText(onlyNumbers.slice(0, 3));
  }

  function handleRadioChange(event) {
    setInputType(event.target.value);
  }

  function handleSave() {
    let timeInSeconds = parseInt(text);
    if (inputType === "minutes") timeInSeconds = timeInSeconds * 60;
    if (inputType === "hours") timeInSeconds = timeInSeconds * 3600;

    if (fields[0] === "gongfu" || fields[0] === "western")
      setTeaData({
        ...teaData,
        [fields[0] + "_brewing"]: {
          ...teaData[fields[0] + "_brewing"],
          [fields[1]]: timeInSeconds,
        },
      });
    else setTeaData({ ...teaData, [field]: timeInSeconds });
    handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={fields[1] ? fields[1] : fields[0]}
        saveName="Save"
        disableSave={!text}
        handleSave={handleSave}
      />
      <Box className={classes.mainBox}>
        <TextField
          className={classes.textField}
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          variant="outlined"
          placeholder={"Enter time in " + inputType}
          fullWidth
          aria-label="time-text"
        />
        <RadioGroup
          aria-label="type"
          name="type"
          value={inputType}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            className={classes.radio}
            value="seconds"
            control={<Radio />}
            label="Seconds"
          />
          <FormControlLabel
            className={classes.radio}
            value="minutes"
            control={<Radio />}
            label="Minutes"
          />
          <FormControlLabel
            className={classes.radio}
            value="hours"
            control={<Radio />}
            label="Hours"
          />
        </RadioGroup>
      </Box>
    </>
  );
}
