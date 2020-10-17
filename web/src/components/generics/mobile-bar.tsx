import React, { ReactChild, ReactElement } from "react";
import { Paper, Slide, useScrollTrigger } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

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

type Props = {
  children: ReactChild;
};

/**
 * Mobile bar component, auto hides on scroll.
 *
 * @component
 * @subcategory Generics
 */
function MobileBar({ children }: Props): ReactElement {
  const classes = useStyles();

  const hideTrigger = useScrollTrigger();
  const shadowTrigger = useScrollTrigger({
    threshold: 1,
    disableHysteresis: true,
  });

  return (
    <Slide appear={false} direction="down" in={!hideTrigger}>
      <Paper className={classes.root} elevation={shadowTrigger ? 3 : 0}>
        {children}
      </Paper>
    </Slide>
  );
}

export default MobileBar;
