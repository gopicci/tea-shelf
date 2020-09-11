import React, { ChangeEvent, ReactElement, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@material-ui/core";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import { TeaInstance, TeaRequest } from "../../../services/models";

/**
 * DetailsBoxNotes props.
 *
 * @memberOf DetailsBoxNotes
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Desktop details page notes box. Shows an add notes button when notes are
 * empty, text input on editing.
 *
 * @component
 * @subcategory Details desktop
 */
function DetailsBoxNotes({ teaData, handleEdit }: Props): ReactElement {
  const classes = desktopDetailsStyles();

  const [notesEditing, setNotesEditing] = useState(false);
  const [notes, setNotes] = useState(teaData.notes ? teaData.notes : "");

  /**
   * Updates local notes state on text input change.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Text input change event
   */
  function handleNotesChange(event: ChangeEvent<HTMLInputElement>): void {
    setNotes(event.target.value);
  }

  /** Updates tea instance with notes changes. */
  function handleNotesSave(): void {
    handleEdit({ ...teaData, notes: notes }, teaData.id);
    setNotesEditing(false);
  }

  return (
    <Box className={classes.row}>
      <Paper className={classes.notesPaper} elevation={0}>
        {notesEditing ? (
          <TextField
            onChange={handleNotesChange}
            id="notes"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            defaultValue={notes}
            variant="outlined"
          />
        ) : (
          notes && (
            <Box className={classes.notesText}>
              {notes.split("\n").map((s, key) => (
                <Typography
                  variant="body2"
                  className={classes.rowCenter}
                  key={key}
                >
                  {s}
                </Typography>
              ))}{" "}
            </Box>
          )
        )}
        <Box className={classes.rowCenter}>
          {notesEditing ? (
            <Button
              className={classes.doubleMargin}
              onClick={handleNotesSave}
              aria-label="save notes"
            >
              Save
            </Button>
          ) : (
            <Button
              className={classes.doubleMargin}
              onClick={() => setNotesEditing(true)}
              aria-label={notes ? "edit notes" : "add notes"}
            >
              {notes ? "Edit" : "Add"} notes
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default DetailsBoxNotes;
