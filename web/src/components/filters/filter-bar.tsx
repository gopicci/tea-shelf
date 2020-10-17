import React, { ReactElement } from "react";
import { Button } from "@material-ui/core";
import FilterBarChips from "./filter-bar-chips";
import MobileBar from "../generics/mobile-bar";
import { Route } from "../../app";

/**
 * FilterBar props.
 *
 * @memberOf FilterBar
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile filter bar component. Contains filters chips, hides on scroll.
 *
 * @component
 * @subcategory Filters
 */
function FilterBar({ setRoute }: Props): ReactElement {
  /** Sets main route to filter */
  function handleButtonClick(): void {
    setRoute({ route: "FILTER" });
  }

  return (
    <MobileBar>
      <>
        <Button
          size="small"
          color="primary"
          disableElevation
          onClick={handleButtonClick}
        >
          Sort & Filter
        </Button>
        <FilterBarChips />
      </>
    </MobileBar>
  );
}

export default FilterBar;
