import React, {
  createContext,
  Dispatch,
  useContext,
  useReducer,
  useEffect,
  useState,
  ReactElement,
  ReactChild,
} from "react";
import {
  getCategoryName,
  getSubcategoryName,
} from "../../services/parsing-services";
import { CategoriesState } from "./categories-context";
import { TeasState } from "./tea-context";
import { SortingOptions, Filters } from "../../services/models";

// Defines initial sorting state
const initialSorting: SortingOptions = {
  "date added": true,
  year: false,
  rating: false,
  alphabetical: false,
  origin: false,
  vendor: false,
};

// Defines initial filters state
const initialFilters: Filters = {
  sorting: { ...initialSorting },
  active: 0,
  filters: {
    categories: {},
    subcategories: {},
    vendors: {},
    countries: {},
    regions: {},
    localities: {},
  },
};

// Defines dispatcher actions
type Action =
  | {
      type: "CHECK_FILTER";
      data: { entry: keyof Filters["filters"]; item: string };
    }
  | { type: "CHECK_SORT"; data: { item: string } }
  | { type: "CLEAR" }
  | { type: "RESET" };

export const FilterState = createContext<Filters>(initialFilters);
export const FilterDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactChild;
};

/**
 * Filters status state and dispatch provider. Structure gets updated on teas state
 * change, dispatch takes care of keeping track of the checked status.
 *
 * @component
 * @subcategory State containers
 */
function FilterContext({ children }: Props): ReactElement {
  const categories = useContext(CategoriesState);
  const teas = useContext(TeasState);

  const [initialState, setInitialState] = useState(initialFilters);

  /**
   * Filter context reducer.
   *
   * @param {Filters} state - Filters state
   * @param {Action} action - Dispatch action
   * @returns {Filters}
   */
  function reducer(state: Filters, action: Action): Filters {
    switch (action.type) {
      case "CHECK_FILTER":
        // Change filter checked status and number of overall checked filters
        let activeUpdate = state.active;
        const checked = !state.filters[action.data.entry][action.data.item];
        if (checked) {
          activeUpdate += 1;
        } else {
          activeUpdate -= 1;
        }
        const newFilterState = JSON.parse(JSON.stringify(state));
        newFilterState.active = activeUpdate;
        newFilterState.filters[action.data.entry][action.data.item] = checked;
        return newFilterState;
      case "CHECK_SORT":
        // Change sorting option status, keep only 1 checked at the time
        const newSort = JSON.parse(JSON.stringify(state));
        newSort.sorting = { ...initialState.sorting };
        newSort.sorting["date added"] = false;
        newSort.sorting[action.data.item] = true;
        return newSort;
      case "CLEAR":
        // Set all filters to unchecked but keep current sorting option
        return {
          ...initialState,
          sorting: state.sorting,
        };
      case "RESET":
        // Set all filters and sorting options to default state
        return initialState;
      default:
        return initialState;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    /**
     * Updates filter state structure on teas or categories state change.
     *
     * @memberOf FilterContext
     */
    function updateFilters(): void {
      if (!teas) return;

      let filters = {...initialFilters.filters};

      for (const tea of teas) {
        if (categories.length && tea.category) {
          // Category defined, add if not present
          const categoryName = getCategoryName(
            categories,
            tea.category
          ).toLowerCase();
          if (!(categoryName in filters.categories))
            filters.categories = {
              ...filters.categories,
              [categoryName]: false,
            };
        }
        if (tea.subcategory) {
          // Subcategory defined, add if not present
          const subcategoryName = getSubcategoryName(tea.subcategory);
          if (!(subcategoryName in filters.subcategories))
            filters.subcategories = {
              ...filters.subcategories,
              [subcategoryName]: false,
            };
        }
        if (tea.origin) {
          if (!(tea.origin.country in filters.countries))
            // Country defined, add if not present
            filters.countries = {
              ...filters.countries,
              [tea.origin.country]: false,
            };
          if (tea.origin.region)
            if (!(tea.origin.region in filters.regions))
              // Region defined, add if not present
              filters.regions = {
                ...filters.regions,
                [tea.origin.region]: false,
              };
          if (tea.origin.locality)
            if (!(tea.origin.locality in filters.localities))
              // Locality defined, add if not present
              filters.localities = {
                ...filters.localities,
                [tea.origin.locality]: false,
              };
        }
        if (tea.vendor) {
          // Vendor defined, add if not present
          if (!(tea.vendor.name in filters.vendors))
            filters.vendors = {...filters.vendors, [tea.vendor.name]: false};
        }
      }

      setInitialState({...initialFilters, filters: filters});
    }
    updateFilters();
  }, [teas, categories]);

  useEffect(() => {
    /**
     * Sets all filters to unchecked on structure change.
     *
     * @memberOf FilterContext
     */
    function clear(): void {
      dispatch({
        type: "CLEAR",
      });
    }
    clear();
  }, [initialState]);

  return (
    <FilterDispatch.Provider value={dispatch}>
      <FilterState.Provider value={state}>{children}</FilterState.Provider>
    </FilterDispatch.Provider>
  );
}

export default FilterContext;
