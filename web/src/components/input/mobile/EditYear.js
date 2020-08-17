import React from "react";
import CheckboxList from "../../generics/CheckboxList";
import CheckboxListItem from "../../generics/CheckboxListItem";
import InputAppBar from "./InputAppBar";

/**
 * Mobile tea creation year list input component.
 *
 * @param teaData {json} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditYear({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const length = 60;
  const currentYear = new Date().getFullYear();
  const years = [...Array(length)].map((_, b) => String(currentYear - b));
  years.push("Unknown");

  const checkboxList = years.reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {});

  function handleChange(event) {
    setTeaData({ ...teaData, [field]: event.target.name });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={field} />
      <CheckboxList
        label=""
        list={checkboxList}
        handleChange={(e) => handleChange(e)}
        reverse={true}
      />
      {[0, 10, 20, 30, 40].map((tens) => (
        <CheckboxListItem
          key={String(currentYear - length - tens)}
          name={String(currentYear - length - tens)}
          checked={false}
          handleChange={handleChange}
        />
      ))}
    </>
  );
}
