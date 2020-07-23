import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  IconButton,
  RadioGroup,
  TextField,
  Toolbar,
  Typography,
} from '@material-ui/core';
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
    padding: theme.spacing(2),
    flexGrow: 1,
  },
}));

export default function EditTime(props) {
  const classes = useStyles();

  const [text, setText] = useState("");
  const [inputType, setInputType] = useState("Seconds");

  const fields = props.field.split("_")

  function handleChange(event){
    const onlyNumbers = event.target.value.replace(/[^0-9]/g, '');
    setText(onlyNumbers.slice(0,3));
  }

  function handleRadioChange(event) {
    setInputType(event.target.value);
  }

  function handleAdd() {
    if (fields[0] === "gongfu" || fields[0] === "western")
      props.setTeaData({
        ...props.teaData,
        [fields[0] + "_brewing"]: {
          ...props.teaData[fields[0] + "_brewing"],
          [fields[1]]: text,
        }
      })
    else props.setTeaData({ ...props.teaData, [props.field]: text });
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
            Add {fields[1] ? fields[1] : fields[0]}
          </Typography>
          <Button color="inherit" disabled={!text} onClick={handleAdd}>
            ADD
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.mainBox}>
        <TextField
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          variant="outlined"
          placeholder="Enter seconds"
          fullWidth
        />
        <FormControl component="fieldset">
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup aria-label="gender" name="gender1" value={value} onChange={handleChange}>
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
            <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" />
          </RadioGroup>
        </FormControl>
      </Box>
    </Box>
  );
}
