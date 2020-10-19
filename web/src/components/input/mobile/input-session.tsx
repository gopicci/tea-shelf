import React, { ReactElement, useContext, useState } from "react";
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
import EditTime from "./edit-time";
import { HandleSessionEdit, SessionEditorContext } from "../../edit-session";
import { BrewingModel, SessionModel } from "../../../services/models";
import { Route } from "../../../app";

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
 * Editing state type for local routing purposes.
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
};

/**
 * Mobile custom session creation input layout component.
 *
 * @component
 * @subcategory Mobile input
 */
function InputSession({ setRoute }: Props): ReactElement {
  const classes = useStyles();

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const [editing, setEditing] = useState<Editing>();
  const [initial, setInitial] = useState("00:00:20");
  const [increments, setIncrements] = useState("00:00:05");

  /** Starts a brewing session from time states */
  function handleStart(): void {
    const brewing: BrewingModel = {
      initial: initial,
      increments: increments,
    };

    const now = new Date().toISOString();

    const session: SessionModel = {
      brewing: brewing,
      current_infusion: 1,
      is_completed: false,
      created_on: now,
      last_brewed_on: now,
    };

    handleSessionEdit(session);
  }

  /** Routes back to main */
  function handleBack(): void {
    setRoute({ route: "MAIN" });
  }

  return editing === "INITIAL" ? (
    <EditTime
      name={"first infusion time"}
      handleUpdate={(time) => setInitial(time)}
      handleBack={() => setEditing(undefined)}
    />
  ) : editing === "INCREMENTS" ? (
    <EditTime
      name={"increments"}
      handleUpdate={(time) => setIncrements(time)}
      handleBack={() => setEditing(undefined)}
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
          <Typography variant="h5">{initial}</Typography>
        </Box>
        <Box className={classes.divider} />
        <Box className={classes.row} onClick={() => setEditing("INCREMENTS")}>
          <Typography variant="h5">Increments</Typography>
          <Typography variant="h5">{increments}</Typography>
        </Box>
        <Box className={classes.divider} />
        <Button
          variant="contained"
          color="secondary"
          className={classes.startButton}
          disabled={initial === "00:00:00"}
          onClick={handleStart}
        >
          Start brewing
        </Button>
      </Box>
    </>
  );
}

export default InputSession;
