import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { cropToNoZeroes } from "../../services/ParsingService";
import InputAppBar from "./InputAppBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
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

export default function EditWeightInput({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation weight input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("grams");

  function handleChange(event) {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setText(onlyNumbers.slice(0, 5));
  }

  function handleRadioChange(event) {
    setInputType(event.target.value);
  }

  function handleAdd() {
    let grams = parseFloat(text);
    if (inputType === "ounces") grams = grams * 28.35;
    if (!isNaN(grams))
      setTeaData({
        ...teaData,
        weight_left: cropToNoZeroes(grams, 1),
      });
    handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={field}
        showAdd={true}
        disableAdd={!text}
        handleAdd={handleAdd}
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
    </Box>
  );
}
