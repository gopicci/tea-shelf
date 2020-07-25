import React from "react";

import GridViewContext from "./GridViewContext";
import CategoriesContext from "./CategoriesContext";
import SubcategoriesContext from "./SubcategoriesContext";
import VendorsContext from "./VendorsContext";
import TeasContext from "./TeasContext";
import FilterContext from "./FilterContext";
import SnackbarContext from "./SnackbarContext";

export default function MainStateContainer(props) {
  /**
   * Wraps central state providers.
   */

  return (
    <SnackbarContext>
      <CategoriesContext>
        <SubcategoriesContext>
          <VendorsContext>
            <TeasContext>
              <FilterContext>
                <GridViewContext>{props.children}</GridViewContext>
              </FilterContext>
            </TeasContext>
          </VendorsContext>
        </SubcategoriesContext>
      </CategoriesContext>
    </SnackbarContext>
  );
}
