import React from "react";
import { List } from "@material-ui/core";
import InputAppBar from "./InputAppBar";
import InputItem from "./InputItem";
import { celsiusToFahrenheit } from "../../../services/parsing-services";
import { formListStyles } from "../../../style/FormListStyles";

/**
 * Mobile tea creation brewing temperature input component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditTemperature({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const formListClasses = formListStyles();

  const degrees = [...Array(100)].map((_, b) => String(b)).reverse();

  function handleClick(degree) {
    if (field === "gongfu_temperature")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          temperature: degree,
        },
      });
    if (field === "western_temperature")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          temperature: degree,
        },
      });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name="Temperature" />
      <List className={formListClasses.list}>
        {degrees.map((d) => (
          <InputItem
            key={d}
            name={d + "°c"}
            value={celsiusToFahrenheit(d) + "F"}
            handleClick={() => handleClick(d)}
          />
        ))}
      </List>
    </>
  );
}
