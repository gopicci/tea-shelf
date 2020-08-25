import React, { ReactChild, ReactElement } from "react";

import GridViewContext from "./grid-view-context";
import CategoriesContext from "./categories-context";
import SubcategoriesContext from "./subcategories-context";
import VendorsContext from "./vendors-context";
import TeaContext from "./tea-context";
import FilterContext from "./filter-context";
import SnackbarContext from "./snackbar-context";
import SearchContext from "./search-context";

type Props = {
  children: ReactChild;
};

/**
 * Wraps and organizes central state providers.
 *
 * @component
 * @subcategory State containers
 */
function MainStateContainer({ children }: Props): ReactElement {
  return (
    <SnackbarContext>
      <CategoriesContext>
        <SubcategoriesContext>
          <VendorsContext>
            <TeaContext>
              <FilterContext>
                <SearchContext>
                  <GridViewContext>{children}</GridViewContext>
                </SearchContext>
              </FilterContext>
            </TeaContext>
          </VendorsContext>
        </SubcategoriesContext>
      </CategoriesContext>
    </SnackbarContext>
  );
}

export default MainStateContainer;
