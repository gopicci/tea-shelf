import React, { ChangeEvent, FocusEvent, ReactElement, useState } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./input-app-bar";
import { parseSecondsToHMS } from "../../../services/parsing-services";

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
 * EditTime props.
 *
 * @memberOf EditTime
 */
type Props = {
  /** Name of object to edit for appbar display */
  name: string;
  /** Updates state with time in HH:MM:SS format */
  handleUpdate: (time: string) => void;
  /** Reroutes to previous */
  handleBack: () => void;
};

/**
 * Mobile brewing time input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditTime({
  name,
  handleUpdate,
  handleBack,
}: Props): ReactElement {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("seconds");

  /**
   * Updates local state on input text change.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Text input change event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const onlyNumbers = event.target.value.replace(/[^0-9]/g, "");
    setText(onlyNumbers.slice(0, 3));
  }

  /**
   * Updates input type on radio select.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Radio buttons change event
   */
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputType(event.target.value);
  }

  /**
   * Converts time to HH:MM:SS format and calls parent update callback.
   */
  function handleSave(): void {
    let timeInSeconds = parseInt(text);
    if (inputType === "minutes") timeInSeconds = timeInSeconds * 60;
    if (inputType === "hours") timeInSeconds = timeInSeconds * 3600;

    handleUpdate(parseSecondsToHMS(timeInSeconds));
    handleBack();
  }

  /**
   * Select text on focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event - Focus event
   */
  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBack}
        name={name}
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

export default EditTime;
