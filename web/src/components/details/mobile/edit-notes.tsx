import React, { ChangeEvent, ReactElement, useState } from "react";
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
import { TeaInstance, TeaRequest } from "../../../services/models";
import { Route } from "../../../app";

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

/**
 * EditNotes props.
 *
 * @memberOf EditNotes
 */
type Props = {
  /** Tea instance data state  */
  teaData: TeaInstance;
  /** Sets tea instance data state */
  setTeaData: (data: TeaInstance) => void;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Mobile tea notes text input component.
 *
 * @component
 * @subcategory Details mobile
 */
function EditNotes({
  teaData,
  setTeaData,
  setRoute,
  handleEdit,
}: Props): ReactElement {
  const classes = useStyles();

  const [text, setText] = useState(teaData.notes ? teaData.notes : "");

  /**
   * Updates local text input state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Item select event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value);
  }

  /**
   * Upload notes, updates state and routes back to tea details.
   */
  function handleSave(): void {
    handleEdit({ ...teaData, notes: text }, teaData.id);
    setTeaData({ ...teaData, notes: text });
    handlePrevious();
  }

  /** Sets route to tea details. */
  function handlePrevious(): void {
    setRoute({ route: "TEA_DETAILS", payload: teaData });
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
          <Button
            color="inherit"
            disabled={!text}
            onClick={handleSave}
            aria-label="save"
          >
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

export default EditNotes;
