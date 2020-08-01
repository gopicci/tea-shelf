import React, { useContext, useEffect, useState } from "react";
import { Grid, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import TeaCard from "./TeaCard";
import { getSubcategoryName } from "../../services/ParsingService";
import { TeasState } from "../statecontainers/TeasContext";
import { FilterState } from "../statecontainers/FilterContext";
import { GridViewState } from "../statecontainers/GridViewContext";
import { CategoriesState } from "../statecontainers/CategoriesContext";
import { SubcategoriesState } from "../statecontainers/SubcategoriesContext";
import { VendorsState } from "../statecontainers/VendorsContext";
import { SearchState } from "../statecontainers/SearchContext";
import { mainTheme as theme } from "../../style/MainTheme";

const useStyles = makeStyles((theme) => ({
  gridRoot: {
    margin: "auto",
    padding: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      paddingTop: theme.spacing(6),
    },
    maxWidth: "100%",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listRoot: {
    margin: "auto",
    maxWidth: 600,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  gridItem: {
    width: 240,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listItem: {
    width: "100%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: 0,
      paddingTop: theme.spacing(1),
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
}));

export default function GridLayout({ setRoute }) {
  /**
   * Grid component containing tea cards. Filters tea cards based on
   * central filter state.
   *
   * @param tea {json} Tea instance data in API format
   * @param gridView {bool} Grid view switch status
   */

  const classes = useStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);
  const filterState = useContext(FilterState);
  const teasState = useContext(TeasState);
  const gridView = useContext(GridViewState);
  const searchState = useContext(SearchState);

  const [filteredTeas, setFilteredTeas] = useState(teasState);


  function sortTeas(teas, sorting) {
    if (teas)
      switch (sorting) {
        case "latest (default)":
          return [...teas].sort(
            (a, b) => Date.parse(b.created_on) - Date.parse(a.created_on)
          );
        case "year":
          return [...teas].sort((a, b) => {
            if (b.year === null || a.year > b.year) return -1;
            if (a.year === null || a.year < b.year) return 1;
            return 0;
          });
        case "rating":
          return [...teas].sort((a, b) => b.rating - a.rating);
        case "alphabetical":
          return [...teas].sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          });
        case "origin":
          return [...teas].sort((a, b) => {
            if (b.origin === null) return -1;
            if (a.origin === null) return 1;
            if (a.origin.country < b.origin.country) return -1;
            if (a.origin.country > b.origin.country) return 1;
            return 0;
          });
        case "vendor":
          return [...teas].sort((a, b) => {
            if (b.vendor === null) return -1;
            if (a.vendor === null) return 1;
            if (a.vendor.name < b.vendor.name) return -1;
            if (a.vendor.name > b.vendor.name) return 1;
            return 0;
          });
        default:
          console.log("def");
      }
  }

  useEffect(() => console.log(filteredTeas), [filteredTeas]);

  useEffect(() => {
    // Sort teas
    const sorted = sortTeas(
      teasState,
      Object.keys(filterState.sorting).find(
        (k) => filterState.sorting[k] === true
      )
    );

    let filtered;
    // Parse entries through selected filters
    if (filterState.active > 0)
      // At least 1 filter entry is checked
      filtered = sorted.filter((tea) => {
        console.log(Date.parse(tea.created_on));
        const category = categories.find(
          (category) => category.id === tea.category
        );
        if (filterState.filters.categories[category.name.toLowerCase()])
          return true;
        if (
          tea.subcategory &&
          filterState.filters.subcategories[getSubcategoryName(tea.subcategory)]
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

    // Parse remaining entries through search input
    if (searchState.length > 1) {
      const search = searchState.toLowerCase();

      setFilteredTeas(
        filtered.filter((tea) => {
          if (tea.name.toLowerCase().includes(search)) return true;

          const category = categories.find(
            (category) => category.id === tea.category
          );
          if (category.name.toLowerCase().includes(search)) return true;
          if (
            tea.subcategory &&
            tea.subcategory.name.toLowerCase().includes(search)
          )
            return true;

          if (tea.vendor && tea.vendor.name.toLowerCase().includes(search))
            return true;

          if (tea.origin) {
            if (
              tea.origin.country &&
              tea.origin.country.toLowerCase().includes(search)
            )
              return true;
            if (
              tea.origin.region &&
              tea.origin.region.toLowerCase().includes(search)
            )
              return true;
            if (
              tea.origin.locality &&
              tea.origin.locality.toLowerCase().includes(search)
            )
              return true;
          }
          return false;
        })
      );
    } else setFilteredTeas(filtered);
  }, [filterState, categories, subcategories, vendors, teasState, searchState]);

  const upSmall = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Grid
      container
      justify="center"
      className={gridView ? classes.gridRoot : classes.listRoot}
    >
      {filteredTeas &&
        filteredTeas.map((tea, i) => (
          <Grid
            item
            className={
              gridView && upSmall ? classes.gridItem : classes.listItem
            }
            key={i}
          >
            <TeaCard
              tea={tea}
              gridView={gridView && upSmall}
              setRoute={setRoute}
            />
          </Grid>
        ))}
    </Grid>
  );
}
