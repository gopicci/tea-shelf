import React, { useState } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { cropToNoZeroes } from "../../../services/ParsingService";
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
 * Mobile tea creation price input component.
 *
 * @param teaData {json} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditPrice({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const classes = useStyles();

  const [textPrice, setTextPrice] = useState("");
  const [textWeight, setTextWeight] = useState(
    teaData.weight_left ? String(teaData.weight_left) : "1"
  );
  const [inputType, setInputType] = useState("grams");

  function handlePriceChange(event) {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setTextPrice(onlyNumbers.slice(0, 5));
  }

  function handleWeightChange(event) {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setTextWeight(onlyNumbers.slice(0, 5));
  }

  function handleRadioChange(event) {
    // Update weight from C to F on radio select
    if (event.target.value !== inputType) {
      setInputType(event.target.value);
      if (event.target.value === "grams")
        setTextWeight(cropToNoZeroes(parseFloat(textWeight) * 28.35, 2));
      else setTextWeight(cropToNoZeroes(parseFloat(textWeight) / 28.35, 2));
    }
  }

  function handleSave() {
    // Add weight_left if it wasn't there yet
    let grams = parseFloat(textWeight);

    if (inputType === "ounces") grams = grams * 28.35;

    const price = parseFloat(textPrice) / grams;

    if (!isNaN(grams) && !isNaN(price))
      if (!teaData.weight_left && grams > 1)
        setTeaData({
          ...teaData,
          [field]: cropToNoZeroes(price, 2),
          weight_left: cropToNoZeroes(grams, 1),
        });
      else
        setTeaData({
          ...teaData,
          [field]: cropToNoZeroes(price, 2),
        });

    handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={field}
        saveName="Save"
        disableSave={!(textPrice && textWeight)}
        handleSave={handleSave}
      />
      <Box className={classes.mainBox}>
        <TextField
          className={classes.textField}
          value={textPrice}
          onChange={handlePriceChange}
          onFocus={handleFocus}
          variant="outlined"
          label={"Enter price paid"}
          aria-label="price"
          fullWidth
        />
        <TextField
          className={classes.textField}
          value={textWeight}
          onChange={handleWeightChange}
          onFocus={handleFocus}
          variant="outlined"
          label={"Enter amount bought in " + inputType}
          aria-label="amount"
          fullWidth
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
            aria-label="grams"
          />
          <FormControlLabel
            className={classes.radio}
            value="ounces"
            control={<Radio />}
            label="Ounces"
            aria-label="ounces"
          />
        </RadioGroup>
      </Box>
    </>
  );
}
