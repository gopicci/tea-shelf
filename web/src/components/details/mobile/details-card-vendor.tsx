import React, { ReactElement } from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { VendorModel } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  name: {
    margin: theme.spacing(1),
  },
}));

/**
 * DetailsCardVendor props.
 *
 * @memberOf DetailsCardVendor
 */
type Props = {
  /** Tea instance vendor data */
  vendor: VendorModel;
};

/**
 * Mobile tea details page vendor card.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsCardVendor({ vendor }: Props): ReactElement {
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block">
          Vendor:
        </Typography>
        <Typography variant="body2" className={classes.name}>
          {vendor.name}
        </Typography>
        {vendor.website && (
          <Link
            href="#"
            onClick={() => window.open("https://" + vendor.website, "_blank")}
            variant="body2"
            color="secondary"
          >
            {vendor.website}
          </Link>
        )}
      </Box>
    </Card>
  );
}

export default DetailsCardVendor;
