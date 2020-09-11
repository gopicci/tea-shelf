import React, { ReactElement } from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { Storefront } from "@material-ui/icons";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { VendorModel } from "../../../services/models";

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
  const classes = mobileDetailsStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <Box className={classes.genericBox}>
        <Box className={classes.titleBox}>
          <Storefront className={classes.titleIcon} />
          <Typography variant="h5">Vendor:</Typography>
        </Box>
        <Typography variant="h3" className={classes.name}>
          {vendor.name}
        </Typography>
        {vendor.website && (
          <Link
            href="#"
            onClick={() => window.open("https://" + vendor.website, "_blank")}
            variant="body2"
          >
            {vendor.website}
          </Link>
        )}
      </Box>
    </Card>
  );
}

export default DetailsCardVendor;
