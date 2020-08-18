import React from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";

const useStyles = makeStyles((theme) => ({
  name: {
    margin: theme.spacing(1),
  },
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
  mapBox: {
    flexGrow: 1,
    margin: theme.spacing(2),
    marginTop: 0,
  },
}));

/**
 * Mobile tea details page vendor card.
 *
 * @param teaData {json} Track the input state
 */
export default function DetailsCardVendor({ teaData }) {
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  return (
    <Card className={detailsClasses.card}>
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block">
          Vendor:
        </Typography>
        <Typography variant="body2" className={classes.name}>
          {teaData.vendor.name}
        </Typography>
        {teaData.vendor.website &&
        <Link href="#" onClick={() => window.open("https://"+teaData.vendor.website, "_blank")} variant="body2">
          {teaData.vendor.website}
        </Link>}
      </Box>
    </Card>
  );
}
