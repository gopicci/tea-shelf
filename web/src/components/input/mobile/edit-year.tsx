import React, { ChangeEvent, ReactElement } from "react";
import CheckboxList from "../../generics/checkbox-list";
import CheckboxListItem from "../../generics/checkbox-list-item";
import InputAppBar from "./input-app-bar";
import { TeaRequest } from "../../../services/models";

/**
 * EditYear props.
 *
 * @memberOf EditYear
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
};

/**
 * Mobile tea editing year select component. Maps years array
 * to a checkbox list and routes back to input layout on pick.
 *
 * @component
 * @subcategory Mobile input
 */
function EditYear({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const length = 60;
  const currentYear = new Date().getFullYear();
  const years = [...Array(length)].map((_, b) => String(currentYear - b));
  years.push("Unknown");

  const checkboxList = years.reduce(
    (obj: { [index: string]: boolean }, item) => {
      obj[item.toLowerCase()] = false;
      return obj;
    },
    {}
  );

  /**
   * Converts year to number, updates the input state and goes
   * back to layout.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Item select event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    let year = event.target.name;
    if (event.target.name === "Unknown") year = "";
    setTeaData({ ...teaData, year: parseInt(year) });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name="year" />
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

export default EditYear;
