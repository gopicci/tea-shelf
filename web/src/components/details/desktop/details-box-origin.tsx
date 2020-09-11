import React, { ReactElement } from "react";
import { Box, Typography } from "@material-ui/core";
import {Public} from '@material-ui/icons';
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
import { geography } from "../../../services/geography";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import { OriginModel } from "../../../services/models";


/**
 * DetailsBoxOrigin props.
 *
 * @memberOf DetailsBoxOrigin
 */
type Props = {
  /** Tea instance origin data */
  origin: OriginModel;
};

/**
 * Desktop details page origin box. Shows origin name if present.
 * Shows map if origin coordinates are present.
 *
 * @component
 * @subcategory Details desktop
 */
function DetailsBoxOrigin({ origin }: Props): ReactElement {
  const classes = desktopDetailsStyles();

  let coordinates: Point | undefined;
  if (origin.longitude && origin.latitude)
    coordinates = [origin.longitude, origin.latitude];

  return (
    <Box className={classes.row}>
      {coordinates && (
        <Box className={classes.halfCenterBox}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 400,
              center: coordinates,
            }}
            className={classes.map}
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
      <Box className={classes.halfCenterBox}>
        <Public className={classes.icon}></Public>
        <Typography variant="h4">Origin:</Typography>
        <Typography variant="h3" className={classes.doubleMargin}>
          {getOriginName(origin)}
        </Typography>
        <ReactCountryFlag
          svg
          style={{
            width: "4em",
            height: "4em",
          }}
          countryCode={getCountryCode(origin.country)}
          alt=""
          aria-label={origin.country}
        />
      </Box>
    </Box>
  );
}

export default DetailsBoxOrigin;
