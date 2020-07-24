import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import { getSubcategoryName } from "../../services/ParsingService";

import { CategoriesState } from "./CategoriesContext";
import { TeasState } from './TeasContext';

export const FilterState = createContext(null);
export const FilterDispatch = createContext(null);

export default function FilterContext(props) {
  const categories = useContext(CategoriesState);
  const teas = useContext(TeasState)

  const sorting = ['Latest (Default)', 'Year', 'Rating', 'Alphabetical', 'Origin', 'Vendor']
    .reduce((obj, item) => {
    obj[item.toLowerCase()] = false;
    return obj;
  }, {});

  const [initialState, setInitialState] = useState({
    sorting: { ...sorting, "latest (default)": true },
    active: 0,
    filters: {
      categories: null,
      subcategories: null,
      vendors: null,
      countries: null,
      regions: null,
      localities: null,
    },
  });

  const reducer = (state, action) => {
    switch (action.type) {
      case "CHECK_FILTER":
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
        const newSort = JSON.parse(JSON.stringify(state));
        newSort.sorting = { ...initialState.sorting };
        newSort.sorting["latest (default)"] = false;
        newSort.sorting[action.data.item] = true;
        return newSort;
      case "CLEAR":
        return {
          ...initialState,
          sorting: state.sorting,
        };
      case "RESET":
        return initialState;
      default:
        return action;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if(!teas) return;
    let update = {...initialState}
    let additions = {filters: {}}
    for (const tea of teas) {
      if (tea.category) {
        const categoryName = categories.find(category => category.id === tea.category).name.toLowerCase();
        if (!initialState.filters.categories || !(categoryName in initialState.filters.categories))
          additions.filters.categories = {...additions.filters.categories, [categoryName]: false}
      }
      if (tea.subcategory) {
        const subcategoryName = getSubcategoryName(tea.subcategory);
        if (!initialState.filters.subcategories || !(subcategoryName in initialState.filters.subcategories))
          additions.filters.subcategories = {...additions.filters.subcategories, [subcategoryName]: false}
      }
      if (tea.origin) {
        if (!initialState.filters.countries || !(tea.origin.country in initialState.filters.countries))
          additions.filters.countries = {...additions.filters.countries, [tea.origin.country]: false}
        if (tea.origin.region)
          if (!initialState.filters.regions || !(tea.origin.region in initialState.filters.regions))
            additions.filters.regions = {...additions.filters.regions, [tea.origin.region]: false}
        if (tea.origin.locality)
          if (!initialState.filters.localities || !(tea.origin.locality in initialState.filters.localities))
            additions.filters.localities = {...additions.filters.localities, [tea.origin.locality]: false}

      }
      if (tea.vendor) {
         if (!initialState.filters.vendors || !(tea.vendor.name in initialState.filters.vendors))
          additions.filters.vendors = {...additions.filters.vendors, [tea.vendor.name]: false}
      }
      if (Object.keys(additions.filters).length > 0) Object.assign(update, additions)
    }
    setInitialState(update);
  }, [teas])

  useEffect(() => {
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
