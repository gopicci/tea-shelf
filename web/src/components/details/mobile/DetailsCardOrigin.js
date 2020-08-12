import React from "react";
import { Box, Card, Typography } from "@material-ui/core";
import ReactCountryFlag from "react-country-flag";
import { makeStyles } from "@material-ui/core/styles";
import {
  getCountryCode,
  getOriginName,
} from "../../../services/ParsingService";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";

const useStyles = makeStyles((theme) => ({
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
}));

export default function DetailsCardOrigin({ teaData }) {
  /**
   * Mobile tea details page origin card.
   *
   * @param teaData {json} Track the input state
   */
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  return (
    <Card className={detailsClasses.card}>
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block">
          Origin:
        </Typography>
        <Typography variant="body2">{getOriginName(teaData.origin)}</Typography>
        <ReactCountryFlag
          svg
          style={{
            width: "2em",
            height: "2em",
          }}
          className={classes.countryFlag}
          countryCode={getCountryCode(teaData.origin.country)}
          alt=""
          aria-label={teaData.origin.country}
        />
      </Box>
    </Card>
  );
}
