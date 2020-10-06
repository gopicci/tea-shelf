import React, { ReactElement } from "react";
import { Box, Card, CardContent, Typography } from "@material-ui/core";
import clsx from "clsx";
import { gridStyles } from "../../style/grid-styles";

/**
 * DateCard props.
 *
 * @memberOf DateCard
 * @subcategory Main
 */
type Props = {
  /** Date object */
  date: Date;
  /** Grid or list mode */
  gridView: boolean;
};

/**
 * Card component visualizing a date as month and year.
 *
 * @component
 * @subcategory Main
 */
function DateCard({ date, gridView }: Props): ReactElement {
  const classes = gridStyles();

  return (
    <Card elevation={0}>
      <CardContent
        className={clsx(
          classes.content,
          classes.dateCard,
          gridView && classes.gridCard,
          !gridView && classes.listCard
        )}
      >
        <Box>
          <Typography variant="h5" display={gridView ? "block" : "inline"} align="center">
            {date.toLocaleString("en-US", { month: "long" })}
            {!gridView && " "}
          </Typography>
          <Typography variant="h5" display={gridView ? "block" : "inline"} align="center">
            {date.toLocaleString("en-US", { year: "numeric" })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default DateCard;
