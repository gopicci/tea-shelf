import React, { useState } from "react";
import { Box, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import InputAppBar from "./InputAppBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

export default function EditText({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation text input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();

  const [text, setText] = useState(teaData[field]);

  const handleChange = (event) => setText(event.target.value);

  function handleAdd() {
    setTeaData({ ...teaData, [field]: text.replace(/\n/g, " ") });
    handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={field}
        showAdd={true}
        disableAdd={!text}
        handleAdd={handleAdd}
      />
      <Box className={classes.textField}>
        <InputBase
          onChange={handleChange}
          onFocus={handleFocus}
          id="standard-multiline"
          rows={4}
          rowsMax={Infinity}
          inputProps={{ maxLength: 50 }}
          multiline
          autoFocus
          fullWidth
          defaultValue={text}
          aria-label="name input"
        />
      </Box>
      <Box className={classes.counter}>
        <Typography>{text.length} / 50</Typography>
      </Box>
    </Box>
  );
}
