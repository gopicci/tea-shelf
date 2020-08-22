import React from "react";
import { Autocomplete } from "@material-ui/lab";

/**
 * Desktop tea creation form brewing weight autocomplete component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param renderInput {component} Input component
 * @param brewing {string} Selected brewing: gongfu_brewing or western_brewing
 */
export default function WeightAutocomplete({
  teaData,
  setTeaData,
  renderInput,
  brewing,
}) {
  const max = brewing === "gongfu_brewing" ? 10 : 2;
  const increment = brewing === "gongfu_brewing" ? 0.5 : 0.1;
  const options = [...Array(max / increment + 1)]
    .map((_, b) => (b * increment).toFixed(1))
    .reverse();

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      setTeaData({
        ...teaData,
        [brewing]: {
          ...teaData[brewing],
          weight: newValue,
        },
      });
    } else
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
      onInputChange={handleOnChange}
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
