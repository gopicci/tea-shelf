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
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add {field}
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
