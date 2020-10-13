import React, { ChangeEvent, ReactElement, useContext } from "react";
import InputAppBar from "./input-app-bar";
import CheckboxList from "../../generics/checkbox-list";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SessionInstance, TeaRequest } from "../../../services/models";
import CheckboxListItem from "../../generics/checkbox-list-item";

/**
 * EditInfusion props.
 *
 * @memberOf EditInfusion
 */
type Props = {
  /** Brewing session state */

  session: SessionInstance;
  /** Sets brewing session state */
  setSession: (session: SessionInstance) => void;
  /** Routes back to SessionLayout */
  handleBackToLayout: () => void;
};

/**
 * Mobile session infusion editing component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditInfusion({
  session,
  setSession,
  handleBackToLayout,
}: Props): ReactElement {
  const length = 40;
  const infusions = [...Array(length)].map((_, i) => String(i + 1));

  const checkboxList = infusions.reduce(
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
    let infusion = event.target.name;
    setSession({ ...session, current_infusion: parseInt(infusion) });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name="infusion" />
      <CheckboxList
        label=""
        list={checkboxList}
        handleChange={(e) => handleChange(e)}
      />
    </>
  );
}

export default EditInfusion;
