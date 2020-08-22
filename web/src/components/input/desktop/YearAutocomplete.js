import React from "react";
import { Autocomplete } from "@material-ui/lab";

/**
 * Desktop tea creation form year autocomplete component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param renderInput {component} Input component
 * @param options {Array} Options array
 * @param updateFormValue {function} Formik change handler
 */
export default function YearAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  options,
  updateFormValue,
}) {

  function handleOnChange(event, newValue) {
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
      value={teaData.year && String(teaData.year)}
      renderInput={renderInput}
    />
  );
}
