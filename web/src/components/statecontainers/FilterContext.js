import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { getSubcategoryName } from "../../services/ParsingService";
import { CategoriesState } from "./CategoriesContext";
import { TeasState } from "./TeasContext";

export const FilterState = createContext(null);
export const FilterDispatch = createContext(null);

// Define sorting options
const sorting = {
  "date added": true,
  year: false,
  rating: false,
  alphabetical: false,
  origin: false,
  vendor: false,
};

// Define initial filters structure
const filtersDefinition = {
  sorting: { ...sorting },
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

/**
 * Filters status state and dispatch provider. Structure gets updated on teas state
 * change, dispatch takes care of keeping track of the checked status.
 */
export default function FilterContext(props) {
  const categories = useContext(CategoriesState);
  const teas = useContext(TeasState);

  const [initialState, setInitialState] = useState(filtersDefinition);

  const reducer = (state, action) => {
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
        return action;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Update state structure on teas state change
    if (!teas) return;

    let filters = { ...filtersDefinition.filters };

    for (const tea of teas) {
      if (categories && tea.category) {
        // Category defined, add if not present
        const categoryName = categories
          .find((category) => category.id === tea.category)
          .name.toLowerCase();
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
          filters.vendors = { ...filters.vendors, [tea.vendor.name]: false };
      }
    }

    setInitialState({ ...filtersDefinition, filters: filters });
  }, [teas, categories]);

  useEffect(() => {
    // Set all filters to unchecked on structure change
    dispatch({
      type: "CLEAR",
    });
  }, [initialState]);

  return (
    <FilterDispatch.Provider value={dispatch}>
      <FilterState.Provider value={state}>
        {props.children}
      </FilterState.Provider>
    </FilterDispatch.Provider>
  );
}
