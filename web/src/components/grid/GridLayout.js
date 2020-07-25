import React, { useContext, useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import TeaCard from "./TeaCard";
import { getSubcategoryName } from "../../services/ParsingService";

import { TeasState } from "../statecontainers/TeasContext";
import { FilterState } from "../statecontainers/FilterContext";
import { GridViewState } from "../statecontainers/GridViewContext";
import { CategoriesState } from "../statecontainers/CategoriesContext";
import { SubcategoriesState } from "../statecontainers/SubcategoriesContext";
import { VendorsState } from "../statecontainers/VendorsContext";

const useStyles = makeStyles((theme) => ({
  gridRoot: {
    margin: "auto",
    padding: theme.spacing(2),
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
    width: 200,
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listItem: {
    width: "100%",
    padding: theme.spacing(1),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
}));

export default function GridLayout() {
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
  const teas = useContext(TeasState);
  const gridView = useContext(GridViewState);

  const [filteredTeas, setFilteredTeas] = useState(teas);

  useEffect(() => {
    if (filterState.active > 0)
      // At least 1 filter entry is checked
      setFilteredTeas(
        teas.filter((tea) => {
          const category = categories.find(
            (category) => category.id === tea.category
          );
          if (filterState.filters.categories[category.name.toLowerCase()])
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
        })
      );
    else setFilteredTeas(teas);
  }, [filterState, categories, subcategories, vendors, teas]);

  let width = window.innerWidth;

  return (
    <Grid
      container
      justify="center"
      className={gridView ? classes.gridRoot : classes.listRoot}
    >
      {filteredTeas &&
        filteredTeas.map((tea) => (
          <Grid
            item
            className={
              gridView && width > 600 ? classes.gridItem : classes.listItem
            }
            key={tea.name}
          >
            <TeaCard tea={tea} gridView={gridView && width > 600} />
          </Grid>
        ))}
    </Grid>
  );
}
