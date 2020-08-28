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
 * EditWeightInput props.
 *
 * @memberOf EditWeightInput
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
};

/**
 * Mobile tea editing weight input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditWeightInput({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("grams");

  /**
   * Updates local state on input text change, accepts numbers input only.
   *
   * @param {event: ChangeEvent<HTMLInputElement>} event - Text input change event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setText(onlyNumbers.slice(0, 5));
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
   * Updates input state with weight in grams and routes back to input layout.
   */
  function handleSave(): void {
    let grams = parseFloat(text);
    if (inputType === "ounces") grams = grams * 28.35;
    if (!isNaN(grams))
      setTeaData({
        ...teaData,
        weight_left: grams,
      });
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
        name="weight"
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
          placeholder={"Enter weight in " + inputType}
          fullWidth
          aria-label="weight"
        />
        <RadioGroup
          aria-label="type"
          name="type"
          value={inputType}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            className={classes.radio}
            value="grams"
            control={<Radio />}
            label="Grams"
          />
          <FormControlLabel
            className={classes.radio}
            value="ounces"
            control={<Radio />}
            label="Ounces"
          />
        </RadioGroup>
      </Box>
    </>
  );
}

export default EditWeightInput;
