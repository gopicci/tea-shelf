import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import GenericAppBar from "../../generics/generic-app-bar";
import { Route } from "../../../app";
import EditTime from "./edit-time";

const useStyles = makeStyles((theme) => ({
  back: {
    marginRight: theme.spacing(2),
  },
  root: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    margin: theme.spacing(2),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up("md")]: {
      padding: theme.spacing(2),
    },
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    margin: "auto",
    marginBottom: theme.spacing(4),
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(3),
    marginTop: theme.spacing(3),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  startButton: {
    marginTop: theme.spacing(3),
  },
}));

/**
 * Editing state type for routing purposes.
 *
 * @memberOf InputSession
 */
type Editing = "INITIAL" | "INCREMENTS" | undefined;

/**
 * InputSession props.
 *
 * @memberOf InputSession
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Mobile custom session creation input layout.
 *
 * @component
 * @subcategory Session
 */
function InputSession({ setRoute, isMobile }: Props): ReactElement {
  const classes = useStyles();

  const [editing, setEditing] = useState<Editing>();

  function handleUpdate(time: string): void {}

  /** Routes back to main */
  function handleBack(): void {
    setRoute({ route: "MAIN" });
  }

  return editing === "INITIAL" ? (
    <EditTime
      name={"first infusion time"}
      handleUpdate={handleUpdate}
      handleBack={handleBack}
    />
  ) : editing === "INCREMENTS" ? (
    <EditTime
      name={"increments"}
      handleUpdate={handleUpdate}
      handleBack={handleBack}
    />
  ) : (
    <>
      <GenericAppBar>
        <Toolbar>
          <IconButton
            onClick={handleBack}
            edge="start"
            className={classes.back}
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h5">Start Custom Brewing</Typography>
        </Toolbar>
      </GenericAppBar>
      <Toolbar />
      <Box className={classes.root}>
        <Box className={classes.row} onClick={() => setEditing("INITIAL")}>
          <Typography variant="h5">First infusion</Typography>
          <Typography variant="h5">00:00:00</Typography>
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.row} onClick={() => setEditing("INCREMENTS")}>
          <Typography variant="h5">Increments</Typography>
          <Typography variant="h5">00:00:00</Typography>
        </Box>
        <Box className={classes.divider} />
        <Button
          variant="contained"
          color="secondary"
          className={classes.startButton}
        >
          Start brewing
        </Button>
      </Box>
    </>
  );
}

export default InputSession;
