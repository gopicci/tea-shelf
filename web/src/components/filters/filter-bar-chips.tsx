import React, { MouseEvent, useContext } from "react";
import { Chip } from "@material-ui/core";
import { FilterDispatch, FilterState } from "../statecontainers/filter-context";
import { Filters } from "../../services/models";

/**
 * Defines chips components for mobile filter bar based on global filters state.
 *
 * @component
 * @subcategory Filters
 */
function FilterBarChips() {
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

  return (
    <>
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
    </>
  );
}

export default FilterBarChips;
