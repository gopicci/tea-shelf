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
  const detailsClasses = mobileDetailsStyles();

  /** Routes to notes editor. */
  function handleEditNotes(): void {
    setRoute({ route: "EDIT_NOTES", payload: teaData });
  }

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <CardActionArea onClick={handleEditNotes} aria-label="edit notes">
        <Box className={detailsClasses.genericBox}>
          {!teaData.notes ? (
            <Typography variant="button" className={detailsClasses.center}>
              Add notes
            </Typography>
          ) : (
            <>
              <Box className={detailsClasses.titleBox}>
                <Notes className={detailsClasses.titleIcon} />
                <Typography variant="h5">Notes:</Typography>
              </Box>
              <Box className={detailsClasses.notesBox}>
                {teaData.notes.split("\n").map((s, key) => (
                  <Typography
                    variant="body1"
                    className={detailsClasses.notes}
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
