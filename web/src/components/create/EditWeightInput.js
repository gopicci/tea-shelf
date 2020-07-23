import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";

import {cropToNoZeroes} from '../../services/ParsingService';

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
  mainBox: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  radio: {
    marginTop: theme.spacing(2),
  },
}));

export default function EditWeightInput(props) {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("grams");


  function handleChange(event){
    const onlyNumbers = event.target.value.replace(/[^0-9.]/g, '');
    setText(onlyNumbers.slice(0,5));
  }

  function handleRadioChange(event) {
    setInputType(event.target.value);
  }

  function handleAdd() {
    let grams = parseFloat(text)
    if (inputType === "ounces")
      grams = grams * 28.35;

    props.setTeaData({ ...props.teaData, weight_left: cropToNoZeroes(grams, 1) });
    props.handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add {props.field}
          </Typography>
          <Button color="inherit" disabled={!text} onClick={handleAdd}>
            ADD
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.mainBox}>
        <TextField
          className={classes.textField}
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          variant="outlined"
          placeholder={"Enter weight in " + inputType}
          fullWidth
        />
        <RadioGroup aria-label="type" name="type" value={inputType} onChange={handleRadioChange}>
          <FormControlLabel className={classes.radio} value="grams" control={<Radio />} label="Grams" />
          <FormControlLabel className={classes.radio} value="ounces" control={<Radio />} label="Ounces" />
        </RadioGroup>
      </Box>
    </Box>
  );
}
