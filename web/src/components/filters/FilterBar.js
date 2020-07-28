import React from "react";
import { Button, Paper, Slide, useScrollTrigger } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FilterBarChips from "./FilterBarChips";

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

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function FilterBar({ setRoute }) {
  /**
   * Mobile filter bar component. Contains filters chips, hides on scroll.
   *
   * @param setRoute {function} Set main route
   */

  const classes = useStyles();

  function handleButtonClick() {
    setRoute({route: "FILTER"});
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
