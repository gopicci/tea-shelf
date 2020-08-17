import React, { useContext } from "react";
import InputAppBar from "./InputAppBar";
import CheckboxList from "../../generics/CheckboxList";
import { brewingTimesToSeconds } from "../../../services/ParsingService";
import { subcategoryModel } from '../../../services/Serializers';
import { CategoriesState } from "../../statecontainers/CategoriesContext";

export default function EditCategory({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation category list input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const categories = useContext(CategoriesState);

  function handleChange(event) {
    console.log(categories);
    for (const entry of Object.entries(categories))
      if (entry[1].name.toLowerCase() === event.target.name.toLowerCase())
        setTeaData({
          ...teaData,
          [field]: entry[1].id,
          subcategory: subcategoryModel,
          gongfu_brewing: brewingTimesToSeconds(entry[1].gongfu_brewing),
          western_brewing: brewingTimesToSeconds(entry[1].western_brewing),
        });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name={field} />
      {categories && (
        <CheckboxList
          label=""
          list={Object.entries(categories)
            .map((entry) => entry[1].name)
            .reduce((obj, item) => {
              obj[item.toLowerCase()] = false;
              return obj;
            }, {})}
          handleChange={(e) => handleChange(e)}
          reverse={field === "year"}
        />
      )}
    </>
  );
}
