import React, { ReactElement } from "react";
import { Box, Card, Typography } from "@material-ui/core";
import ReactCountryFlag from "react-country-flag";
import { makeStyles } from "@material-ui/core/styles";
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
    marginBottom: -theme.spacing(1),
  },
}));

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
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

  let coordinates: Point | undefined;
  if (origin.longitude && origin.latitude)
    coordinates = [origin.longitude, origin.latitude];

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block">
          Origin:
        </Typography>
        <Typography variant="body2" className={classes.name}>
          {getOriginName(origin)}
        </Typography>
        <ReactCountryFlag
          svg
          style={{
            width: "2em",
            height: "2em",
          }}
          className={classes.countryFlag}
          countryCode={getCountryCode(origin.country)}
          alt=""
          aria-label={origin.country}
        />
      </Box>
      {coordinates && (
        <Box className={classes.mapBox}>
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
