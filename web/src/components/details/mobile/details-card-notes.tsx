import React, { ReactElement } from "react";
import { Box, Card, CardActionArea, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { TeaInstance } from "../../../services/models";
import { Route } from "../../../app";

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

/**
 * DetailsCardNotes props.
 *
 * @memberOf DetailsCardNotes
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Mobile tea details page notes card.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsCardNotes({ teaData, setRoute }: Props): ReactElement {
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

  /** Routes to notes editor. */
  function handleEditNotes(): void {
    setRoute({ route: "EDIT_NOTES", payload: teaData });
  }

  return (
    <Card className={detailsClasses.card}>
      <CardActionArea onClick={handleEditNotes} aria-label="Edit notes">
        <Box className={detailsClasses.genericBox}>
          <Typography variant="caption" display="block">
            {teaData.notes && "Edit notes:"}
          </Typography>

          {!teaData.notes ? (
            <Typography variant="button" className={detailsClasses.center}>
              Add notes
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

export default DetailsCardNotes;
