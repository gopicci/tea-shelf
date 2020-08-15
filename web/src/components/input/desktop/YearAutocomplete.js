import React from "react";
import { Autocomplete } from "@material-ui/lab";

export default function YearAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  options,
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

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string")
      setTeaData({ ...teaData, year: newValue });
    else setTeaData({ ...teaData, year: null });
  }

  return (
    <Autocomplete
      id="year"
      onChange={handleOnChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options ? options : []}
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
