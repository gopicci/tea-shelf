import React from "react";
import {
  AppBar,
  Box,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

import { makeStyles } from "@material-ui/core/styles";

import InputItem from "./InputItem";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

export default function EditWeightList(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const crop = props.data.increment < 1 ? 1 : 0;
  const list = [...Array(props.data.max / props.data.increment + 1)]
    .map((_, b) => String((b * props.data.increment).toFixed(crop)))
    .reverse();

  function handleClick(weight) {
    if (props.field === "gongfu_weight")
      props.setTeaData({
        ...props.teaData,
        gongfu_brewing: {
          ...props.teaData.gongfu_brewing,
          weight: parseFloat(weight),
        },
      });
    else if (props.field === "western_weight")
      props.setTeaData({
        ...props.teaData,
        western_brewing: {
          ...props.teaData.western_brewing,
          weight: parseFloat(weight),
        },
      });
    else props.setTeaData({ ...props.teaData, [props.field]: weight });
    props.handleBackToLayout();
  }

  return (
    <Box className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            onClick={props.handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Select weight {(props.field === "gongfu_weight" || props.field === "western_weight") && "per 100ml"}
          </Typography>
        </Toolbar>
      </AppBar>
      <List className={formListClasses.list}>
        {list.map((w) => (
          <InputItem
            key={w}
            name={w + "g"}
            value=""
            handleClick={() => handleClick(w)}
          />
        ))}
      </List>
    </Box>
  );
}
