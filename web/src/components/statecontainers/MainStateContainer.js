import React from "react";

import GridViewContext from "./GridViewContext";
import CategoriesContext from "./CategoriesContext";
import SubcategoriesContext from "./SubcategoriesContext";
import TeasContext from "./TeasContext";

export default function MainStateContainer(props) {
  return (
    <CategoriesContext>
      <SubcategoriesContext>
        <TeasContext>
          <GridViewContext>{props.children}</GridViewContext>
        </TeasContext>
      </SubcategoriesContext>
    </CategoriesContext>
  );
}
