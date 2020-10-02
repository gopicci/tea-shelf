import React, { ReactElement } from "react";
import {
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GenericAppBar from "../generics/generic-app-bar";
import { ArrowBack } from "@material-ui/icons";
import Countdown from "react-countdown";

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
  timer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    flexGrow: 1,
  },
  timerFont: {
    fontSize: "30vw",
    lineHeight: 1,
  },
  endButton: {
    width: "100%",
  },
}));

type CountdownProps = {
  minutes: number;
  seconds: number;
};

function SessionLayout(): ReactElement {
  const classes = useStyles();

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
        <Typography variant="h4">Temp</Typography>
        <Typography variant="h4">Infusion</Typography>
      </Box>
      <Box className={classes.timer}>
        <Typography className={classes.timerFont}>
          <Countdown
            date={Date.now() + 10000}
            renderer={({
              minutes,
              seconds,
            }: CountdownProps): ReactElement => {
              return (
                <span>
                  {String(minutes).padStart(2, "0")}:
                  {String(seconds).padStart(2, "0")}
                </span>
              );
            }}
            onComplete={() => console.log("end")}
          />
        </Typography>
        <Button variant="contained" color="secondary">
          Brew/Cancel
        </Button>
      </Box>
      <Button className={classes.endButton}>End session</Button>
    </Box>
  );
}

export default SessionLayout;
