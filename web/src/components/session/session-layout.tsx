import React, { ReactElement, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import GenericAppBar from "../generics/generic-app-bar";
import SessionClock from "./session-clock";
import { BrewingModel, BrewingSession } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    minWidth: "100%",
    justifyContent: "space-between",
  },
  endButton: {
    width: "100%",
  },
}));

/**
 * Brewing session layout component.
 *
 * @component
 * @subcategory Brewing session
 */
function SessionLayout(): ReactElement {
  const classes = useStyles();

  const brewing: BrewingModel = {
    temperature: 95,
    weight: 5,
    initial: "00:00:10",
    increments: "00:00:05",
  };

  const [session, setSession] = useState<BrewingSession>({
    brewing: brewing,
    created_on: String(Date.now()),
    current_infusion: 1,
    is_completed: false,
  });

  return (
    <Box className={classes.root}>
      <GenericAppBar>
        <Toolbar>
          <Box className={classes.row}>
            <IconButton edge="start" aria-label="back">
              <ArrowBack />
            </IconButton>
          </Box>
        </Toolbar>
      </GenericAppBar>
      <Toolbar />
      <Typography variant="h1">Name</Typography>
      <Typography variant="h5">Started on date</Typography>
      <Box className={classes.row}>
        <Typography variant="h4">Temp {session.brewing.temperature}</Typography>
        <Typography variant="h4">
          Infusion {session.current_infusion}
        </Typography>
      </Box>
      <SessionClock session={session} setSession={setSession} />
      <Button className={classes.endButton}>End session</Button>
    </Box>
  );
}

export default SessionLayout;
