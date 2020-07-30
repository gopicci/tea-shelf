import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
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

export default function EditNotes({
  teaData,
  handleEdit,
  handlePrevious,
}) {
  /**
   * Mobile tea creation text input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleEdit {function} Handle edit save
   * @param handlePrevious {function} Reroutes to tea details
   */

  const classes = useStyles();

  const [text, setText] = useState(teaData.notes ? teaData.notes : "");

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleSave() {
    handleEdit({ ...teaData, notes: text });
    handlePrevious();
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={handlePrevious}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {teaData.notes ? "Edit Notes" : "Add notes"}
          </Typography>
          <Button color="inherit" disabled={!text} onClick={handleSave} aria-label="save">
            SAVE
          </Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.textField}>
        <InputBase
          onChange={handleChange}
          id="standard-multiline"
          rows={4}
          rowsMax={Infinity}
          inputProps={{ maxLength: 3000 }}
          multiline
          autoFocus
          fullWidth
          defaultValue={text}
          aria-label="name input"
        />
      </Box>
      <Box className={classes.counter}>
        <Typography>{text.length} / 3000</Typography>
      </Box>
    </>
  );
}
