import React, { MouseEvent, ReactElement, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Chip, Typography } from "@material-ui/core";
import { FilterDispatch, FilterState } from "../statecontainers/filter-context";
import { Filters } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",

    "& > *": {
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
    },
  },
  title: {
    fontSize: theme.typography.pxToRem(15),
  },
}));

/**
 * Chips components for desktop accordion, based on filters state.
 *
 * @component
 * @subcategory Filters
 */
function FilterAccordionChips(): ReactElement {
  const classes = useStyles();

  const state = useContext(FilterState);
  const dispatch = useContext(FilterDispatch);

  /**
   * Deletes chip by updating global filter status
   * to unchecked.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   * @param {Filters} entry - Filter group (keyof Filters["filters"])
   * @param {string} item - Filter item
   */
  function handleDelete(
    event: MouseEvent<HTMLDivElement>,
    entry: keyof Filters["filters"],
    item: string
  ): void {
    dispatch({
      type: "CHECK_FILTER",
      data: { entry: entry, item: item },
    });
  }

  /**
   * Update global filter status to uncheck all filters.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Change event
   */
  function handleReset(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    dispatch({
      type: "CLEAR",
    });
  }

  return (
    <Box className={classes.root}>
      {!state.active && (
        <Typography className={classes.title}>Sort & Filter</Typography>
      )}
      {state.active > 0 && (
        <Button
          size="small"
          color="primary"
          disableElevation
          onClick={handleReset}
        >
          Clear
        </Button>
      )}
      {Object.entries(state.filters).map(
        ([entry, list]) =>
          list &&
          Object.entries(list).map(
            ([item, checked]) =>
              item &&
              checked && (
                <Chip
                  key={item}
                  label={item}
                  onClick={(e: MouseEvent<HTMLDivElement>) => {
                    e.stopPropagation();
                  }}
                  onDelete={(e) =>
                    handleDelete(e, entry as keyof Filters["filters"], item)
                  }
                  size="small"
                />
              )
          )
      )}
    </Box>
  );
}

export default FilterAccordionChips;
