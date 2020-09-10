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
    borderBottom: `solid 1px ${theme.palette.divider}`,
    paddingTop: theme.spacing(1),
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",

    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

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

  const hideTrigger = useScrollTrigger();
  const shadowTrigger = useScrollTrigger({threshold: 1, disableHysteresis: true});

  /** Sets main route to filter */
  function handleButtonClick(): void {
    setRoute({ route: "FILTER" });
  }

  return (
    <>
      <Slide appear={false} direction="down" in={!hideTrigger}>
        <Paper className={classes.root} elevation={shadowTrigger ? 3 : 0}>
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
      </Slide>
    </>
  );
}

export default FilterBar;
