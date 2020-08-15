import React from "react";
import { Autocomplete } from "@material-ui/lab";

export default function WeightAutocomplete({
  teaData,
  setTeaData,
  renderInput,
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

  const max = gongfu ? 10 : 2
  const increment = gongfu ? 0.5 : 0.1
  const options = [...Array(max / increment + 1)]
    .map((_, b) => (b * increment).toFixed(1))
    .reverse();

  function handleOnChange(event, newValue) {
    console.log(newValue)
    if (typeof newValue === "string") {
      console.log(brewing, newValue)
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          weight: newValue,
        },
      });}
    else
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          weight: null,
        },
      });
  }

  return (
    <Autocomplete
      id="brewingWeight"
      onChange={handleOnChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      freeSolo
      options={options}
      value={teaData[brewing].weight ? String(teaData[brewing].weight) : ""}
      renderOption={(option) => (option.inputValue ? option.label : option)}
      renderInput={renderInput}
    />
  );
}
