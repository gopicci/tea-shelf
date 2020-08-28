import React, { ReactElement } from "react";
import { List } from "@material-ui/core";
import InputAppBar from "./input-app-bar";
import InputItem from "./input-item";
import { formListStyles } from "../../../style/form-list-styles";
import { TeaRequest } from "../../../services/models";

/**
 * EditWeightList props.
 *
 * @memberOf EditWeightList
 */
type Props = {
  /** Weight list settings, max weight and list increments */
  settings: { max: number; increment: number };
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
 * Mobile tea editing brewing weight list input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditWeightList({
  settings,
  teaData,
  setTeaData,
  handleBackToLayout,
  route,
}: Props): ReactElement {
  const formListClasses = formListStyles();

  const crop = settings.increment < 1 ? 1 : 0;
  const list = [...Array(settings.max / settings.increment + 1)]
    .map((_, b) => String((b * settings.increment).toFixed(crop)))
    .reverse();

  /**
   * Handles weight list item select. Updates input status
   * and routes to input layout.
   *
   * @param {string} weight - Selected weight
   */
  function handleClick(weight: string): void {
    if (route === "gongfu_weight")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          weight: parseFloat(weight),
        },
      });
    else if (route === "western_weight")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          weight: parseFloat(weight),
        },
      });
    else setTeaData({ ...teaData, [route]: weight });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={route} />
      <List className={formListClasses.list}>
        {list.map((w) => (
          <InputItem
            key={w}
            name={w + "g"}
            value=""
            handleClick={() => handleClick(w)}
          />
        ))}
      </List>
    </>
  );
}

export default EditWeightList;
