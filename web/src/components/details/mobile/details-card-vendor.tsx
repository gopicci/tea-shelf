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
  const detailsClasses = mobileDetailsStyles();

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <Box className={detailsClasses.genericBox}>
        <Box className={detailsClasses.titleBox}>
          <Storefront className={detailsClasses.titleIcon} />
          <Typography variant="h5">Vendor:</Typography>
        </Box>
        <Typography variant="h3" className={detailsClasses.name}>
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
