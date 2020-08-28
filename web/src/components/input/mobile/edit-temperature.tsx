import React, { ReactElement } from "react";
import { List } from "@material-ui/core";
import InputAppBar from "./input-app-bar";
import InputItem from "./input-item";
import { celsiusToFahrenheit } from "../../../services/parsing-services";
import { formListStyles } from "../../../style/FormListStyles";
import { TeaRequest } from "../../../services/models";

/**
 * EditTemperature props.
 *
 * @memberOf EditTemperature
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
  /** Edit route name state */
  route: string;
};

/**
 * Mobile tea creation brewing temperature input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditTemperature({
  teaData,
  setTeaData,
  handleBackToLayout,
  route,
}: Props): ReactElement {
  const formListClasses = formListStyles();

  const degrees = [...Array(100)].map((_, b) => String(b)).reverse();

  /**
   * Sets input state and routes back to input layout.
   *
   * @param {number} degrees - Temperature in Celsius
   */
  function handleClick(degrees: number): void {
    if (route === "gongfu_temperature")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          temperature: degrees,
        },
      });
    if (route === "western_temperature")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          temperature: degrees,
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
            value={celsiusToFahrenheit(parseInt(d)) + "F"}
            handleClick={() => handleClick(parseInt(d))}
          />
        ))}
      </List>
    </>
  );
}

export default EditTemperature;
