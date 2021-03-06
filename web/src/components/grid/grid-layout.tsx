import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Box, Grid } from "@material-ui/core";
import clsx from "clsx";
import SessionsGrid from "./sessions-grid";
import TeaCard from "./tea-card";
import { getSubcategoryName } from "../../services/parsing-services";
import { getCategoryName } from "../../services/parsing-services";
import { gridStyles } from "../../style/grid-styles";
import { TeasState } from "../statecontainers/tea-context";
import { FilterState } from "../statecontainers/filter-context";
import { SettingsState } from "../statecontainers/settings-context";
import { CategoriesState } from "../statecontainers/categories-context";
import { SubcategoriesState } from "../statecontainers/subcategories-context";
import { VendorsState } from "../statecontainers/vendors-context";
import { SearchState } from "../statecontainers/search-context";
import { Route } from "../../app";
import { TeaInstance } from "../../services/models";

/**
 * GridLayout props.
 *
 * @memberOf GridLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Grid component containing tea cards. Filters tea cards based on
 * global filter state.
 *
 * @component
 * @subcategory Grid
 */
function GridLayout({ route, setRoute, isMobile }: Props): ReactElement {
  const classes = gridStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);
  const filterState = useContext(FilterState);
  const teasState = useContext(TeasState);
  const settings = useContext(SettingsState);
  const searchState = useContext(SearchState);

  const [filteredTeas, setFilteredTeas] = useState<TeaInstance[]>(teasState);

  /**
   * Sort array of tea instances based on sorting type.
   *
   * @param {TeaInstance[]} teas - Array of tea objects
   * @param {string} sorting - Sorting type
   * @returns {TeaInstance[]} Sorted tea instances array
   */
  function sortTeas(teas: TeaInstance[], sorting: string): TeaInstance[] {
    switch (sorting) {
      case "date added":
        return [...teas].sort((a, b) => {
          if (!a.created_on) return -1;
          if (!b.created_on) return 1;
          return Date.parse(b.created_on) - Date.parse(a.created_on);
        });
      case "year":
        return [...teas].sort((a, b) => {
          if (!a.year) return 1;
          if (!b.year) return -1;
          return b.year - a.year;
        });
      case "rating":
        return [...teas].sort((a, b) => {
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          return b.rating - a.rating;
        });
      case "alphabetical":
        return [...teas].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
      case "origin":
        return [...teas].sort((a, b) => {
          if (!a.origin?.country) return 1;
          if (!b.origin?.country) return -1;
          if (a.origin.country > b.origin.country) return 1;
          if (a.origin.country < b.origin.country) return -1;
          return 0;
        });
      case "vendor":
        return [...teas].sort((a, b) => {
          if (!a.vendor?.name) return 1;
          if (!b.vendor?.name) return -1;
          if (a.vendor.name > b.vendor.name) return 1;
          if (a.vendor.name < b.vendor.name) return -1;
          return 0;
        });
      default:
        // date added
        return [...teas].sort((a, b) => {
          if (!a.created_on) return 1;
          if (!b.created_on) return -1;
          return Date.parse(b.created_on) - Date.parse(a.created_on);
        });
    }
  }

  useEffect(() => {
    /**
     * Keeps visualized tea instances state sorted and filtered based on
     * selected filters and search bar input.
     */
    function filterTeas(): void {
      // Parse archive
      let teas = teasState.filter((tea) => {
        if (route.route === "ARCHIVE") return tea.is_archived;
        else return !tea.is_archived;
      });

      // Sort teas
      let sorting = Object.keys(filterState.sorting).find(
        (k) => filterState.sorting[k]
      );
      if (!sorting) sorting = "";
      let sorted = sortTeas(teas, sorting);
      if (sorted && filterState.reversed) sorted = sorted.reverse();

      // Parse entries through selected filters
      let filtered;
      if (filterState.active)
        // At least 1 filter entry is checked
        filtered = sorted.filter((tea) => {
          const category = getCategoryName(categories, tea.category);
          if (filterState.filters.categories[category.toLowerCase()])
            return true;
          if (
            tea.subcategory &&
            filterState.filters.subcategories[
              getSubcategoryName(tea.subcategory)
            ]
          )
            return true;
          if (tea.vendor && filterState.filters.vendors[tea.vendor.name])
            return true;
          if (tea.origin) {
            if (
              tea.origin.country &&
              filterState.filters.countries[tea.origin.country]
            )
              return true;
            if (
              tea.origin.region &&
              filterState.filters.regions[tea.origin.region]
            )
              return true;
            if (
              tea.origin.locality &&
              filterState.filters.localities[tea.origin.locality]
            )
              return true;
          }
          return false;
        });
      else filtered = sorted;

      if (filtered) {
        // Parse remaining entries through search input
        if (searchState.length > 1) {
          const search = searchState.toLowerCase();

          setFilteredTeas(
            filtered.filter((tea) => {
              if (tea.name.toLowerCase().includes(search)) return true;

              const category = getCategoryName(categories, tea.category);
              if (category.toLowerCase().includes(search)) return true;
              if (
                tea.subcategory?.name.toLowerCase().includes(search) ||
                tea.subcategory?.translated_name?.toLowerCase().includes(search)
              )
                return true;

              if (tea.vendor?.name.toLowerCase().includes(search)) return true;

              if (tea.origin?.country?.toLowerCase().includes(search))
                return true;
              if (tea.origin?.region?.toLowerCase().includes(search))
                return true;
              if (tea.origin?.locality?.toLowerCase().includes(search))
                return true;

              return false;
            })
          );
        } else setFilteredTeas(filtered);
      }
    }
    if (teasState.length) filterTeas();
    else setFilteredTeas(teasState);
  }, [
    filterState,
    categories,
    subcategories,
    vendors,
    teasState,
    searchState,
    route,
  ]);

  return (
    <Box
      className={clsx(
        classes.root,
        settings.gridView && classes.gridRoot,
        !settings.gridView && classes.listRoot,
        isMobile && route.route !== "SESSIONS" && classes.extraTopPadding
      )}
    >
      {["SESSIONS", "CREATE_SESSION", "SESSION_DETAILS"].includes(
        route.route
      ) ? (
        <SessionsGrid setRoute={setRoute} isMobile={isMobile} />
      ) : (
        <Grid container justify="center">
          {filteredTeas &&
            filteredTeas.map((tea, i) => (
              <Grid
                item
                className={
                  settings.gridView && !isMobile
                    ? classes.gridItem
                    : classes.listItem
                }
                key={i}
              >
                <TeaCard
                  teaData={tea}
                  gridView={!!(settings.gridView && !isMobile)}
                  setRoute={setRoute}
                />
              </Grid>
            ))}
        </Grid>
      )}
    </Box>
  );
}

export default GridLayout;
