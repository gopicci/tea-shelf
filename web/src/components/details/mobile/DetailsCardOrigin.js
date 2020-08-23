import React from "react";
import { Box, Card, Typography } from "@material-ui/core";
import ReactCountryFlag from "react-country-flag";
import { makeStyles } from "@material-ui/core/styles";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import {
  getCountryCode,
  getOriginName,
} from "../../../services/parsing-services";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";
import { geography } from "../../../services/Geography";

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
 * Mobile tea details page origin card.
 *
 * @param teaData {Object} Track the input state
 */
export default function DetailsCardOrigin({ teaData }) {
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  let coordinates;
  if (teaData.origin.longitude && teaData.origin.latitude)
    coordinates = [teaData.origin.longitude, teaData.origin.latitude];

  return (
    <Card className={detailsClasses.card}>
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block">
          Origin:
        </Typography>
        <Typography variant="body2" className={classes.name}>
          {getOriginName(teaData.origin)}
        </Typography>
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
                      geo.properties.NAME === teaData.origin.country
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
