import React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";

const useStyles = makeStyles((theme) => ({
  notesBox: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    minHeight: theme.spacing(16),
    paddingBottom: theme.spacing(2),
  },
  notes: {
    textAlign: "left",
  },
}));

export default function DetailsCardNotes({ teaData, setRoute }) {
  /**
   * Mobile tea details page notes card.
   *
   * @param setRoute {function} Set main route
   * @param teaData {json} Track the input state
   */
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  function handleEditNotes() {
    setRoute({ route: "EDIT_NOTES", data: teaData });
  }

  return (
    <Card className={detailsClasses.card}>
      <CardActionArea onClick={handleEditNotes} aria-label="Edit notes">
        <Box className={detailsClasses.genericBox}>
          <Typography variant="caption" display="block">
            {teaData.notes && "Edit notes:"}
          </Typography>

          {!teaData.notes ? (
            <Typography variant="caption" className={classes.center}>
              <Button>Add notes</Button>
            </Typography>
          ) : (
            <Box className={classes.notesBox}>
              {teaData.notes.split("\n").map((s, key) => (
                <Typography variant="body1" className={classes.notes} key={key}>
                  {s}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
