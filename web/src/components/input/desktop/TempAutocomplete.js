import React from "react";
import { Autocomplete } from "@material-ui/lab";
import { celsiusToFahrenheit } from "../../../services/ParsingService";

/**
 * Desktop tea creation form temperature autocomplete component.
 *
 * @param teaData {json} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param renderInput {component} Input component
 * @param fahrenheit {boolean} Use fahrenheit or celsius
 * @param brewing {string} Selected brewing: gongfu_brewing or western_brewing
 */
export default function TempAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  fahrenheit,
  brewing,
}) {
  const options = [...Array(100)]
    .map((_, b) => String(fahrenheit ? celsiusToFahrenheit(b) : b))
    .reverse();

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          temperature: newValue,
        },
      });
    } else
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
      onInputChange={handleOnChange}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="temperature"
      options={options}
      freeSolo
      value={
        teaData[brewing].temperature ? String(teaData[brewing].temperature) : ""
      }
      getOptionLabel={(option) => {
        if (typeof option === "string") return option;
        if (option.inputValue) return option.inputValue;
        return option;
      }}
      renderOption={(option) => (option.inputValue ? option.label : option)}
      renderInput={renderInput}
    />
  );
}
