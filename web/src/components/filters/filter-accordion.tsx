import React, { ReactElement, useContext, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Box,
  Button,
  Grid,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import FilterAccordionChips from "./filter-accordion-chips";
import FilterList from "./filter-list";
import { FilterDispatch, FilterState } from "../statecontainers/filter-context";
import { Filters } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "block",
    width: "80%",
    margin: "auto",
    marginTop: theme.spacing(4),
    padding: "auto",
  },
  accordion: {
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
  },
  accordionDetails: {
    padding: 0,
  },
  listGrid: {
    display: "flex",
    flexGrow: 1,
  },
  listItem: {
    minWidth: 220,
    flexGrow: 1,
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

/**
 * Desktop mode filters accordion component.
 *
 * @component
 * @subcategory Filters
 */
function FilterAccordion(): ReactElement {
  const classes = useStyles();

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  const [open, setOpen] = useState(false);

  /** Toggles accordion expansion */
  function handleExpansion(): void {
    setOpen(!open);
  }

  /** Resets filters state and closes accordion */
  function handleReset(): void {
    dispatch({
      type: "RESET",
    });
    setOpen(!open);
  }

  return (
    <Box className={classes.root}>
      <Accordion elevation={0} expanded={open} className={classes.accordion}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1c-content"
          id="panel1c-header"
          onClick={handleExpansion}
        >
          <FilterAccordionChips />
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid container justify="center" className={classes.listGrid}>
            <Grid item className={classes.listItem}>
              <FilterList key="sortList" entry="sorting" list={state.sorting} />
            </Grid>
            {Object.entries(state.filters).map(([entry, list]) => (
              <Grid item className={classes.listItem} key={entry}>
                <FilterList
                  entry={entry as keyof Filters["filters"]}
                  list={list}
                />
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
        <AccordionActions className={classes.actions}>
          <Button size="small" color="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button size="small" color="secondary" onClick={handleExpansion}>
            Close
          </Button>
        </AccordionActions>
      </Accordion>
    </Box>
  );
}

export default FilterAccordion;
