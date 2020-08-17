import React from "react";
import { List } from "@material-ui/core";
import InputAppBar from "./InputAppBar";
import InputItem from "./InputItem";
import { formListStyles } from "../../../style/FormListStyles";

/**
 * Mobile tea creation weight list input component.
 *
 * @param data {{max: int , increments: int}} Weight list data
 * @param teaData {json} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */
export default function EditWeightList({
  data,
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const formListClasses = formListStyles();

  const crop = data.increment < 1 ? 1 : 0;
  const list = [...Array(data.max / data.increment + 1)]
    .map((_, b) => String((b * data.increment).toFixed(crop)))
    .reverse();

  function handleClick(weight) {
    if (field === "gongfu_weight")
      setTeaData({
        ...teaData,
        gongfu_brewing: {
          ...teaData.gongfu_brewing,
          weight: parseFloat(weight),
        },
      });
    else if (field === "western_weight")
      setTeaData({
        ...teaData,
        western_brewing: {
          ...teaData.western_brewing,
          weight: parseFloat(weight),
        },
      });
    else setTeaData({ ...teaData, [field]: weight });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={field} />
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
