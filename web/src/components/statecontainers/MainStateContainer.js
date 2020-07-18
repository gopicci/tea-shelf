import React from "react";

import GridViewContext from "./GridViewContext";
import CategoriesContext from "./CategoriesContext";
import SubcategoriesContext from "./SubcategoriesContext";
import TeasContext from "./TeasContext";
import FilterContext from './FilterContext';

export default function MainStateContainer(props) {
  return (
    <CategoriesContext>
      <SubcategoriesContext>
        <TeasContext>
          <FilterContext>
            <GridViewContext>
              {props.children}
            </GridViewContext>
          </FilterContext>
        </TeasContext>
      </SubcategoriesContext>
    </CategoriesContext>
  );
}
