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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";

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

export default function EditTime(props) {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("seconds");

  const fields = props.field.split("_");

  function handleChange(event) {
    const onlyNumbers = event.target.value.replace(/[^0-9]/g, "");
    setText(onlyNumbers.slice(0, 3));
  }

  function handleRadioChange(event) {
    setInputType(event.target.value);
  }

  function handleAdd() {
    let timeInSeconds = parseInt(text);
    if (inputType === "minutes") timeInSeconds = timeInSeconds * 60;
    if (inputType === "hours") timeInSeconds = timeInSeconds * 3600;

    if (fields[0] === "gongfu" || fields[0] === "western")
      props.setTeaData({
        ...props.teaData,
        [fields[0] + "_brewing"]: {
          ...props.teaData[fields[0] + "_brewing"],
          [fields[1]]: timeInSeconds,
        },
      });
    else props.setTeaData({ ...props.teaData, [props.field]: timeInSeconds });
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
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add {fields[1] ? fields[1] : fields[0]}
          </Typography>
          <Button
            color="inherit"
            disabled={!text}
            onClick={handleAdd}
            aria-label="add"
          >
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
          placeholder={"Enter time in " + inputType}
          fullWidth
          aria-label="time-text"
        />
        <RadioGroup
          aria-label="type"
          name="type"
          value={inputType}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            className={classes.radio}
            value="seconds"
            control={<Radio />}
            label="Seconds"
          />
          <FormControlLabel
            className={classes.radio}
            value="minutes"
            control={<Radio />}
            label="Minutes"
          />
          <FormControlLabel
            className={classes.radio}
            value="hours"
            control={<Radio />}
            label="Hours"
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}
