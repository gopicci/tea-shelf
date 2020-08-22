import React, { useState } from "react";
import { Box, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import InputAppBar from "./InputAppBar";

const useStyles = makeStyles((theme) => ({
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

/**
 * Mobile tea creation text input component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param field {string} Input field name
 * @param handleBackToLayout {function} Reroutes to input layout
 */

export default function EditText({
  teaData,
  setTeaData,
  field,
  handleBackToLayout,
}) {
  const classes = useStyles();

  const [text, setText] = useState(teaData[field]);

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleSave() {
    setTeaData({ ...teaData, [field]: text.replace(/\n/g, " ") });
    handleBackToLayout();
  }

  function handleFocus(event) {
    event.target.select();
  }

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={field}
        saveName="Save"
        disableSave={!text}
        handleSave={handleSave}
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
    </>
  );
}
