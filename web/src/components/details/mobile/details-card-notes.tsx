import React, { ReactElement } from "react";
import { Box, Card, CardActionArea, Typography } from "@material-ui/core";
import { Notes } from "@material-ui/icons";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { TeaInstance } from "../../../services/models";
import { Route } from "../../../app";

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
  const classes = mobileDetailsStyles();

  /** Routes to notes editor. */
  function handleEditNotes(): void {
    setRoute({ route: "EDIT_NOTES", payload: teaData });
  }

  return (
    <Card className={classes.card} variant="outlined">
      <CardActionArea onClick={handleEditNotes} aria-label="edit notes">
        <Box className={classes.genericBox}>
          {!teaData.notes ? (
            <Typography variant="button" className={classes.center}>
              Add notes
            </Typography>
          ) : (
            <>
              <Box className={classes.titleBox}>
                <Notes className={classes.titleIcon} />
                <Typography variant="h5">Notes:</Typography>
              </Box>
              <Box className={classes.notesBox}>
                {teaData.notes.split("\n").map((s, key) => (
                  <Typography
                    variant="body1"
                    className={classes.notes}
                    key={key}
                  >
                    {s}
                  </Typography>
                ))}
              </Box>
            </>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}

export default DetailsCardNotes;
