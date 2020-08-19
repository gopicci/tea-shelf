import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import { ArrowDropUp, ArrowDropDown } from "@material-ui/icons";
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
  sortByBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(1),
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
  },
  reverseButton: {
    display: "flex",
    cursor: "pointer",
  },
  sortByText: {
    flexGrow: 1,
    margin: "auto",
  },
}));

/**
 * Grid component containing tea cards. Filters tea cards based on
 * central filter state.
 *
 * @param setRoute {function} Set main route
 * @param setDialog {function} Set dialog route state
 * @param desktop {boolean} Desktop mode or mobile
 */
export default function GridLayout({ setRoute, setDialog, desktop }) {
  const classes = useStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);
  const filterState = useContext(FilterState);
  const teasState = useContext(TeasState);
  const gridView = useContext(GridViewState);
  const searchState = useContext(SearchState);

  const [filteredTeas, setFilteredTeas] = useState(teasState);
  const [sorting, setSorting] = useState("");
  const [reversed, setReversed] = useState(false);

  function sortTeas(teas, sorting) {
    if (teas)
      switch (sorting) {
        case "date added":
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
          return [...teas].sort(
            (a, b) => Date.parse(b.created_on) - Date.parse(a.created_on)
          );
      }
  }

  useEffect(() => console.log(filteredTeas), [filteredTeas]);

  useEffect(() => {
    // Sort teas
    const sorting = Object.keys(filterState.sorting).find(
      (k) => filterState.sorting[k] === true
    );
    setSorting(sorting);
    let sorted = sortTeas(teasState, sorting);
    if (reversed) sorted = sorted.reverse();

    let filtered;
    // Parse entries through selected filters
    if (filterState.active > 0)
      // At least 1 filter entry is checked
      filtered = sorted.filter((tea) => {
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
  }, [
    filterState,
    categories,
    subcategories,
    vendors,
    teasState,
    searchState,
    reversed,
  ]);

  return (
    <Box className={gridView ? classes.gridRoot : classes.listRoot}>
      <Box className={classes.sortByBox}>
        <Box
          className={classes.reverseButton}
          onClick={() => setReversed(!reversed)}
        >
          <Typography variant="caption" className={classes.sortByText}>
            Sorting by {sorting}
          </Typography>
          {reversed ? <ArrowDropUp /> : <ArrowDropDown />}
        </Box>
      </Box>
      <Grid container justify="center">
        {filteredTeas &&
          filteredTeas.map((tea, i) => (
            <Grid
              item
              className={
                gridView && desktop ? classes.gridItem : classes.listItem
              }
              key={i}
            >
              <TeaCard
                tea={tea}
                gridView={gridView && desktop}
                setRoute={setRoute}
                setDialog={setDialog}
                desktop={desktop}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
}
