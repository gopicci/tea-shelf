import React from "react";
import { Autocomplete } from "@material-ui/lab";

export default function YearAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  options,
  updateFormValue,
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
    console.log(newValue)
    if (event) {
      event.target.name = "year";
      updateFormValue(event);
    }
    if (typeof newValue === "string")
      setTeaData({ ...teaData, year: newValue });
    else setTeaData({ ...teaData, year: "" });
  }

  return (
    <Autocomplete
      id="year"
      onChange={handleOnChange}
      onInputChange={handleOnChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      freeSolo
      value={teaData.year}
      renderInput={renderInput}
    />
  );
}
