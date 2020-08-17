import React from "react";

import GridViewContext from "./GridViewContext";
import CategoriesContext from "./CategoriesContext";
import SubcategoriesContext from "./SubcategoriesContext";
import VendorsContext from "./VendorsContext";
import TeasContext from "./TeasContext";
import FilterContext from "./FilterContext";
import SnackbarContext from "./SnackbarContext";
import SearchContext from "./SearchContext";

/**
 * Wraps central state providers.
 */
export default function MainStateContainer(props) {
  return (
    <SnackbarContext>
      <CategoriesContext>
        <SubcategoriesContext>
          <VendorsContext>
            <TeasContext>
              <FilterContext>
                <SearchContext>
                  <GridViewContext>{props.children}</GridViewContext>
                </SearchContext>
              </FilterContext>
            </TeasContext>
          </VendorsContext>
        </SubcategoriesContext>
      </CategoriesContext>
    </SnackbarContext>
  );
}
