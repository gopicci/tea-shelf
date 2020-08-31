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
import { cropToNoZeroes } from "../../../services/parsing-services";
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
 * EditPrice props.
 *
 * @memberOf EditPrice
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
 * Mobile tea creation price input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditPrice({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const classes = useStyles();

  const [textPrice, setTextPrice] = useState("");
  const [textWeight, setTextWeight] = useState(
    teaData.weight_left ? cropToNoZeroes(teaData.weight_left) : "1"
  );
  const [inputType, setInputType] = useState("grams");

  /**
   * Sets local price context on input change.
   *
   * @param {event:ChangeEvent<HTMLInputElement>} event - Price input change event
   */
  function handlePriceChange(event: ChangeEvent<HTMLInputElement>): void {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setTextPrice(onlyNumbers.slice(0, 5));
  }

  /**
   * Sets local weight context on input change.
   *
   * @param {event:ChangeEvent<HTMLInputElement>} event - Weight input change event
   */
  function handleWeightChange(event: ChangeEvent<HTMLInputElement>): void {
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, "");
    setTextWeight(onlyNumbers.slice(0, 5));
  }

  /**
   * Updates weight between Celsius and Fahrenheit on radio select.
   *
   * @param {event:ChangeEvent<HTMLInputElement>} event - Radio buttons change event
   */
  function handleRadioChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.value !== inputType) {
      setInputType(event.target.value);
      if (event.target.value === "grams")
        setTextWeight(cropToNoZeroes(parseFloat(textWeight) * 28.35, 2));
      else setTextWeight(cropToNoZeroes(parseFloat(textWeight) / 28.35, 2));
    }
  }

  /**
   * Updates input state with price, adds weight_left if not present and
   * routes back to input layout.
   */
  function handleSave(): void {
    let grams = parseFloat(textWeight);

    if (inputType === "ounces") grams = grams * 28.35;

    const price = parseFloat(textPrice) / grams;

    if (!isNaN(grams) && !isNaN(price))
      if (!teaData.weight_left && grams > 1)
        setTeaData({
          ...teaData,
          price: price,
          weight_left: grams,
        });
      else
        setTeaData({
          ...teaData,
          price: price,
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
        name="price"
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

export default EditPrice;
