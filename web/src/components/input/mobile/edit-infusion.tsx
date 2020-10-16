import React, { ChangeEvent, ReactElement, useContext } from "react";
import InputAppBar from "./input-app-bar";
import CheckboxList from "../../generics/checkbox-list";
import { SessionInstance } from "../../../services/models";
import { HandleSessionEdit, SessionEditorContext } from "../../edit-session";

/**
 * EditInfusion props.
 *
 * @memberOf EditInfusion
 */
type Props = {
  /** Brewing session state */
  session: SessionInstance;
  /** Routes back to SessionLayout */
  handleBackToLayout: () => void;
};

/**
 * Mobile session infusion editing component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditInfusion({ session, handleBackToLayout }: Props): ReactElement {
  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

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
  async function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    try {
      await handleSessionEdit(
        {
          ...session,
          current_infusion: parseInt(event.target.name),
        },
        session.offline_id
      );
    } catch (e) {
      console.error(e);
    }
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
