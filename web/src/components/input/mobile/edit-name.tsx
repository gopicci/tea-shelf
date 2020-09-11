import React, { ChangeEvent, FocusEvent, ReactElement, useState } from "react";
import { Box, InputBase, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./input-app-bar";
import { TeaRequest } from "../../../services/models";

const maxLength = 50;

const useStyles = makeStyles((theme) => ({
  textField: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: "right",
  },
}));

/**
 * EditName props.
 *
 * @memberOf EditName
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
};

/**
 * Mobile tea editing name editing component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditName({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const classes = useStyles();

  const [text, setText] = useState(teaData.name);

  /**
   * Updates local text input state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Item select event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value);
  }

  /**
   * Updates tea input state and routes back to input layout.
   */
  function handleSave(): void {
    setTeaData({ ...teaData, name: text.replace(/\n/g, " ") });
    handleBackToLayout();
  }

  /**
   * Select text on focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event - Focus event
   */
  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name="name"
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
          inputProps={{ maxLength: maxLength }}
          multiline
          autoFocus
          fullWidth
          defaultValue={text}
          aria-label="name input"
        />
      </Box>
      <Box className={classes.counter}>
        <Typography>
          {text.length} / {maxLength}
        </Typography>
      </Box>
    </>
  );
}

export default EditName;
