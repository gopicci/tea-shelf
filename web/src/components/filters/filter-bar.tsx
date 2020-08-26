import React, { ReactElement } from "react";
import { Button, Paper, Slide, useScrollTrigger } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FilterBarChips from "./filter-bar-chips";
import { Route } from "../../app";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    position: "fixed",
    top: "50px",
    zIndex: 2,
    width: "100vw",
    borderRadius: 0,
    paddingTop: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",

    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

type HOSProps = {
  children: ReactElement;
};

/**
 * Hides children on scroll.
 *
 * @param {ReactElement} children
 * @returns {ReactElement}
 * @memberOf FilterBar
 */
function HideOnScroll({ children }: HOSProps): ReactElement {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

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
  const classes = useStyles();

  /** Sets main route to filter */
  function handleButtonClick(): void {
    setRoute({ route: "FILTER" });
  }

  return (
    <>
      <HideOnScroll>
        <Paper className={classes.root}>
          <Button
            size="small"
            color="primary"
            disableElevation
            onClick={handleButtonClick}
          >
            Sort & Filter
          </Button>
          <FilterBarChips />
        </Paper>
      </HideOnScroll>
    </>
  );
}

export default FilterBar;
