import React from "react";

import GridViewContext from "./GridViewContext";
import CategoriesContext from "./categories-context";
import SubcategoriesContext from "./SubcategoriesContext";
import VendorsContext from "./VendorsContext";
import TeaContext from "./tea-context";
import FilterContext from "./filter-context";
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
            <TeaContext>
              <FilterContext>
                <SearchContext>
                  <GridViewContext>{props.children}</GridViewContext>
                </SearchContext>
              </FilterContext>
            </TeaContext>
          </VendorsContext>
        </SubcategoriesContext>
      </CategoriesContext>
    </SnackbarContext>
  );
}
