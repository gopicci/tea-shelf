import React, { ReactElement } from "react";
import { Box, Card, Typography } from "@material-ui/core";
import { Public } from "@material-ui/icons";
import ReactCountryFlag from "react-country-flag";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Point,
} from "react-simple-maps";
import {
  getCountryCode,
  getOriginName,
} from "../../../services/parsing-services";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { geography } from "../../../services/geography";
import { OriginModel } from "../../../services/models";

/**
 * DetailsCardOrigin props.
 *
 * @memberOf DetailsCardOrigin
 */
type Props = {
  origin: OriginModel;
};

/**
 * Mobile tea details page origin card.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsCardOrigin({ origin }: Props): ReactElement {
  const detailsClasses = mobileDetailsStyles();

  let coordinates: Point | undefined;
  if (origin.longitude && origin.latitude)
    coordinates = [origin.longitude, origin.latitude];

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <Box className={detailsClasses.genericBox}>
        <Box className={detailsClasses.titleBox}>
          <Public className={detailsClasses.titleIcon} />
          <Typography variant="h5">Origin:</Typography>
        </Box>
        <Typography variant="h3" className={detailsClasses.name}>
          {getOriginName(origin)}
        </Typography>
        <ReactCountryFlag
          svg
          style={{
            width: "2em",
            height: "2em",
          }}
          className={detailsClasses.countryFlag}
          countryCode={getCountryCode(origin.country)}
          alt=""
          aria-label={origin.country}
        />
      </Box>
      {coordinates && (
        <Box className={detailsClasses.mapBox}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 400,
              center: coordinates,
            }}
          >
            <Geographies geography={geography}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      geo.properties.NAME === origin.country
                        ? "#ccc"
                        : "#EAEAEC"
                    }
                    stroke="#D6D6DA"
                  />
                ))
              }
            </Geographies>
            <Marker key="marker" coordinates={coordinates}>
              <circle r={10} fill="#F00" stroke="#fff" strokeWidth={2} />
            </Marker>
          </ComposableMap>
        </Box>
      )}
    </Card>
  );
}

export default DetailsCardOrigin;
