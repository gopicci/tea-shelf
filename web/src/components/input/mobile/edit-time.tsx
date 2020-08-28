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
import { TeaRequest } from "../../../services/models";
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
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
  /** Edit route name state */
  route: string;
};

/**
 * Mobile tea creation brewing time list input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditTime({
  teaData,
  setTeaData,
  handleBackToLayout,
  route,
}: Props): ReactElement {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("seconds");

  const fields = route.split("_");

  /**
   * Updates local state on input text change.
   *
   * @param {event: ChangeEvent<HTMLInputElement>} event - Text input change event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const onlyNumbers = event.target.value.replace(/[^0-9]/g, "");
    setText(onlyNumbers.slice(0, 3));
  }

  /**
   * Updates input type on radio select.
   *
   * @param {event: ChangeEvent<HTMLInputElement>} event - Radio buttons change event
   */
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>): void {
    setInputType(event.target.value);
  }

  /**
   * Converts time to HH:MM:SS format, updates input state and
   * returns to input layout.
   */
  function handleSave(): void {
    let timeInSeconds = parseInt(text);
    if (inputType === "minutes") timeInSeconds = timeInSeconds * 60;
    if (inputType === "hours") timeInSeconds = timeInSeconds * 3600;

    const timeInHMS = parseSecondsToHMS(timeInSeconds);

    if (fields[0] === "gongfu" || fields[0] === "western")
      setTeaData({
        ...teaData,
        [fields[0] + "_brewing"]: {
          ...teaData[fields[0] + "_brewing"],
          [fields[1]]: timeInHMS,
        },
      });
    else setTeaData({ ...teaData, [route]: timeInHMS });
    handleBackToLayout();
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

export default EditTime;
