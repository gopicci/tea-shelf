import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@material-ui/core";
import { Notes } from "@material-ui/icons";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import {
  Confirmation,
  TeaInstance,
  TeaRequest,
} from "../../../services/models";
import { Route } from "../../../app";

/**
 * DetailsBoxNotes props.
 *
 * @memberOf DetailsBoxNotes
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Handles tea posting process */
  handleTeaEdit: (data: TeaRequest, id?: number) => void;
  /** Set confirmation on close */
  setConfirmation: (confirmation?: Confirmation) => void;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Desktop details page notes box. Shows an add notes button when notes are
 * empty, text input on editing.
 *
 * @component
 * @subcategory Details desktop
 */
function DetailsBoxNotes({
  teaData,
  handleTeaEdit,
  setConfirmation,
  setRoute,
}: Props): ReactElement {
  const classes = desktopDetailsStyles();

  const [notesEditing, setNotesEditing] = useState(false);
  const [notes, setNotes] = useState(teaData.notes ? teaData.notes : "");

  useEffect(() => {
    if (notesEditing)
      setConfirmation({
        message: "Save notes?",
        callback: () => {
          handleTeaEdit({ ...teaData, notes: notes }, teaData.offline_id);
          setRoute({ route: "MAIN" });
        },
      });
    else setConfirmation(undefined);
  }, [handleTeaEdit, notes, notesEditing, setConfirmation, setRoute, teaData]);

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
    handleTeaEdit({ ...teaData, notes: notes }, teaData.offline_id);
    setNotesEditing(false);
  }

  return (
    <Box className={classes.row}>
      <Paper className={classes.notesPaper} elevation={0}>
        <Box className={classes.row}>
          <Notes className={classes.notesIcon}></Notes>
        </Box>
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
            <Button onClick={handleNotesSave} aria-label="save notes">
              Save
            </Button>
          ) : (
            <Button
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
