import React, { FocusEvent, ReactElement } from "react";
import { TeaRequest } from "../../../services/models";
import EditTime from "./edit-time";

/**
 * EditTeaTime props.
 *
 * @memberOf EditTeaTime
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
 * Wrapper around generic brewing time editor for tea creation.
 *
 * @component
 * @subcategory Mobile input
 */
function EditTeaTime({
  teaData,
  setTeaData,
  handleBackToLayout,
  route,
}: Props): ReactElement {
  const fields = route.split("_");

  /**
   * Updates input state with brewing time.
   *
   * @param {string} time - Time in HH:MM:SS format
   */
  function handleUpdate(time: string): void {
    if (fields[0] === "gongfu" || fields[0] === "western")
      setTeaData({
        ...teaData,
        [fields[0] + "_brewing"]: {
          ...teaData[fields[0] + "_brewing"],
          [fields[1]]: time,
        },
      });
    else setTeaData({ ...teaData, [route]: time });
  }

  /**
   * Select text on focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event - Focus event
   */
  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  return (
    <EditTime
      name={fields[0] ? fields[0] : fields[1]}
      handleUpdate={handleUpdate}
      handleBack={handleBackToLayout}
    />
  );
}

export default EditTeaTime;
