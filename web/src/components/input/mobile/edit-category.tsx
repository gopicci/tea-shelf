import React, { ChangeEvent, ReactElement, useContext } from "react";
import InputAppBar from "./input-app-bar";
import CheckboxList from "../../generics/checkbox-list";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeaRequest } from "../../../services/models";

/**
 * EditCategory props.
 *
 * @memberOf EditCategory
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
 * Mobile tea editing category component. Maps categories context
 * to a checkbox list and routes back to input layout on pick.
 *
 * @component
 * @subcategory Mobile input
 */
function EditCategory({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const categories = useContext(CategoriesState);

  /**
   * Updates input data state and routes back to input layout.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Item select event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    for (const category of Object.values(categories))
      if (category.name.toLowerCase() === event.target.name.toLowerCase())
        setTeaData({
          ...teaData,
          category: category.id,
          subcategory: undefined,
          gongfu_brewing: category.gongfu_brewing && category.gongfu_brewing,
          western_brewing: category.western_brewing && category.western_brewing,
        });
    handleBackToLayout();
  }

  return (
    <>
      <InputAppBar handleBackToLayout={handleBackToLayout} name="category" />
      {categories && (
        <CheckboxList
          list={Object.entries(categories)
            .map((entry) => entry[1].name)
            .reduce((obj: { [index: string]: boolean }, item) => {
              obj[item.toLowerCase()] = false;
              return obj;
            }, {})}
          handleChange={handleChange}
        />
      )}
    </>
  );
}

export default EditCategory;
