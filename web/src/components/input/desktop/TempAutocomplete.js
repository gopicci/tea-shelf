import React from "react";
import { Autocomplete } from "@material-ui/lab";
import { celsiusToFahrenheit } from "../../../services/ParsingService";

export default function TempAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  imperial,
  gongfu,
}) {
  /**
   * Mobile tea creation subcategory input component. Shows a list and autocomplete from
   * central subcategories state, with option to add extra.
   * Updates category entry if different than ones in matching subcategory.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const brewing = gongfu ? "gongfu_brewing" : "western_brewing";

  const options = [...Array(100)]
    .map((_, b) => String(imperial ? celsiusToFahrenheit(b) : b))
    .reverse();

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          temperature: newValue,
        },
      });}
    else
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          temperature: null,
        },
      });
  }

  return (
    <Autocomplete
      onChange={handleOnChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="temperature"
      options={options}
      value={teaData[brewing].temperature ? String(teaData[brewing].temperature) : ""}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option;
      }}
      renderOption={(option) => (option.inputValue ? option.label : option)}
      renderInput={renderInput}
    />
  );
}
