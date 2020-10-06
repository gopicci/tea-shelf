import React, { ReactChild, ReactElement } from "react";
import SyncContext from "./sync-context";
import SettingsContext from "./settings-context";
import CategoriesContext from "./categories-context";
import SubcategoriesContext from "./subcategories-context";
import VendorsContext from "./vendors-context";
import TeaContext from "./tea-context";
import FilterContext from "./filter-context";
import SnackbarContext from "./snackbar-context";
import SearchContext from "./search-context";
import SessionContext from "./session-context";

type Props = {
  children: ReactChild;
};

/**
 * Wraps and organizes global state providers.
 *
 * @component
 * @subcategory State containers
 */
function MainStateContainer({ children }: Props): ReactElement {
  return (
    <SyncContext>
      <SnackbarContext>
        <CategoriesContext>
          <SubcategoriesContext>
            <VendorsContext>
              <TeaContext>
                <FilterContext>
                  <SessionContext>
                    <SearchContext>
                      <SettingsContext>{children}</SettingsContext>
                    </SearchContext>
                  </SessionContext>
                </FilterContext>
              </TeaContext>
            </VendorsContext>
          </SubcategoriesContext>
        </CategoriesContext>
      </SnackbarContext>
    </SyncContext>
  );
}

export default MainStateContainer;
