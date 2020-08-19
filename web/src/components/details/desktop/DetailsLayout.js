import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Link,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import emptyImage from "../../../empty.png";
import {
  getCountryCode,
  getOriginName,
  getSubcategoryName,
} from "../../../services/ParsingService";
import { CategoriesState } from "../../statecontainers/CategoriesContext";
import Rating from "@material-ui/lab/Rating";
import { Star } from "@material-ui/icons";
import InputBrewing from "../../input/mobile/InputBrewing";
import ReactCountryFlag from "react-country-flag";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geography } from "../../../services/Geography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    width: "100%",
    flexGrow: 1,
    margin: 0,
    flexDirection: "column",
  },
  main: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "scroll",
    margin: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(1),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  teaImage: {
    minWidth: theme.spacing(28),
    maxWidth: theme.spacing(28),
    minHeight: theme.spacing(36),
    maxHeight: theme.spacing(36),
    objectFit: "cover",
    borderRadius: theme.spacing(0.75),
  },
  titleBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    flexGrow: 1,
    marginLeft: theme.spacing(2),
    padding: theme.spacing(2),
  },
  title: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(4),
  },
  category: {
    textTransform: "capitalize",
  },
  rowSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: theme.spacing(2),
  },
  ratingBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  ratingNumber: {
    marginRight: theme.spacing(1),
  },
  brewingBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    minWidth: 250,
  },
  brewingTitle: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
  },
  brewingSwitch: {
    position: "absolute",
    right: theme.spacing(2),
    top: "50%",
    transform: "translateY(-50%)",
  },
  smallTitle: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  editNotesButton: {
    marginTop: theme.spacing(2),
  },
  originBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "50%",
  },
  countryFlag: {
    marginLeft: theme.spacing(2),
  },
  map: {
    marginTop: theme.spacing(2),
  },
  bottom: {
    position: "fixed",
    bottom: theme.spacing(2),
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-between",
    margin: theme.spacing(2),
  },
}));

/**
 * Main mobile tea details page layout.
 *
 * @param teaData {json} Track the input state
 * @param handleEdit {function} Handle state edits
 */
export default function TeaDetails({ teaData, handleEdit, setDialog }) {
  const classes = useStyles();
  const categories = useContext(CategoriesState);

  const [gongfu, setGongfu] = useState(true);
  const [notesEditing, setNotesEditing] = useState(false);
  const [notes, setNotes] = useState(teaData.notes ? teaData.notes : "");

  let coordinates;
  if (teaData.origin.longitude && teaData.origin.latitude)
    coordinates = [teaData.origin.longitude, teaData.origin.latitude];

  let description;
  let description_source;
  if (teaData.subcategory && teaData.subcategory.description) {
    description = teaData.subcategory.description;
    description_source = teaData.subcategory.description_source;
  } else {
    const category = Object.entries(categories).find(
      (entry) => entry[1].id === teaData.category
    )[1];
    description = category.description;
    description_source = category.description_source;
  }

  function handleNotesChange(event) {
    setNotes(event.target.value);
  }

  function handleNotesSave() {
    handleEdit({ ...teaData, notes: notes });
    setNotesEditing(false);
  }

  function handleRatingChange(_, value) {
    handleEdit({ ...teaData, rating: value * 2 });
  }

  function handleSwitch() {
    setGongfu(!gongfu);
  }

  return (
    <Box className={classes.root}>
      {teaData && (
        <Box className={classes.main}>
          <Box className={classes.row}>
            <img
              src={teaData.image ? teaData.image : emptyImage}
              alt=""
              className={classes.teaImage}
            />
            <Box className={classes.titleBox}>
              <Typography variant="h1" className={classes.title}>
                {teaData.name}
              </Typography>
              <Typography variant="h2" className={classes.subtitle}>
                {teaData.year} {getSubcategoryName(teaData.subcategory)}
              </Typography>
              <Box className={classes.rowSpace}>
                <Box className={classes.ratingBox}>
                  {teaData.rating > 0 && (
                    <Typography variant="h1" className={classes.ratingNumber}>
                      {teaData.rating / 2}
                    </Typography>
                  )}
                  <Rating
                    name="customized-empty"
                    value={teaData.rating / 2 || 0}
                    precision={0.5}
                    size="large"
                    onChange={handleRatingChange}
                    emptyIcon={<Star fontSize="inherit" />}
                  />
                </Box>
                <Box className={classes.brewingBox}>
                  <Box className={classes.brewingTitle}>
                    <Typography variant="caption">
                      Brewing instructions:
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        className={classes.brewingSwitch}
                        value="start"
                        control={<Switch size="small" color="default" />}
                        label={
                          <Typography variant="caption">
                            {gongfu ? "Gongfu" : "Western"}
                          </Typography>
                        }
                        labelPlacement="start"
                        onChange={handleSwitch}
                      />
                    </FormGroup>
                  </Box>
                  <Box className={classes.brewing}>
                    <InputBrewing
                      name={gongfu ? "gongfu" : "western"}
                      teaData={teaData}
                      handleClick={null}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.divider} />
          {notesEditing ? (
            <TextField
              onChange={handleNotesChange}
              id="notes"
              label="Notes"
              fullWidth
              multiline
              rows={4}
              defaultValue={notes}
              variant="outlined"
            />
          ) : (
            notes && (
              <>
                <Typography variant="body2" className={classes.smallTitle}>
                  Notes:
                </Typography>
                {notes.split("\n").map((s, key) => (
                  <Typography
                    variant="body2"
                    className={classes.rowCenter}
                    key={key}
                  >
                    {s}
                  </Typography>
                ))}{" "}
              </>
            )
          )}
          <Box className={classes.rowCenter}>
            {notesEditing ? (
              <Button
                className={classes.editNotesButton}
                onClick={handleNotesSave}
              >
                Save
              </Button>
            ) : (
              <Button
                className={classes.editNotesButton}
                onClick={() => setNotesEditing(true)}
              >
                {notes ? "Edit" : "Add"} notes
              </Button>
            )}
          </Box>
          <Box className={classes.divider} />
          <Box className={classes.row}>
            <Box className={classes.originBox}>
              <Typography variant="body2" className={classes.smallTitle}>
                Origin:
              </Typography>
              <Box className={classes.rowCenter}>
                <Typography variant="body2">
                  {getOriginName(teaData.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  countryCode={getCountryCode(teaData.origin.country)}
                  alt=""
                  aria-label={teaData.origin.country}
                  className={classes.countryFlag}
                />
              </Box>
              {coordinates && (
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
              )}
            </Box>
            {description && (
              <Box className={classes.originBox}>
                <Typography variant="body2" className={classes.smallTitle}>
                  Description:
                </Typography>
                {description.split("\n").map((s, key) => (
                  <Typography
                    variant="body2"
                    className={classes.rowCenter}
                    key={key}
                  >
                    {s}
                  </Typography>
                ))}
                {description_source && (
                  <Link
                    href="#"
                    onClick={() =>
                      window.open("https://" + description_source, "_blank")
                    }
                    variant="body2"
                  >
                    View source
                  </Link>
                )}
              </Box>
            )}
          </Box>
        </Box>
      )}
      <Box className={classes.bottom}>
        <Button
          onClick={() => setDialog({ route: "", data: null })}
          aria-label="close"
        >
          Close
        </Button>
        <Button
          aria-label="edit"
        >
          Edit
        </Button>
      </Box>
    </Box>
  );
}
