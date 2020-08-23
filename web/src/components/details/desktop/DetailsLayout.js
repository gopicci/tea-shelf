import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControlLabel,
  FormGroup,
  Link,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import emptyImage from "../../../media/empty.png";
import {
  getCountryCode,
  getOriginName,
  getSubcategoryName,
} from "../../../services/parsing-services";
import { CategoriesState } from "../../statecontainers/categories-context";
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
  content: {
    display: "flex",
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    overflowY: "scroll",
    padding: theme.spacing(4),
    margin: 0,
  },
  actions: {
    margin: 0,
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
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
    marginTop: theme.spacing(2),
  },
  topBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
    paddingBottom: theme.spacing(2),
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  vendor: {
    marginBottom: theme.spacing(2),
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
  notesPaper: {
    width: "66%",
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(10),
    padding: theme.spacing(2),
    boxShadow: "5px 5px 20px #ccc",
  },
  notesText: {
    paddingTop: theme.spacing(2),
  },
  doubleMargin: {
    margin: theme.spacing(2),
  },
  countryFlag: {
    marginLeft: theme.spacing(2),
  },
  map: {
    marginTop: theme.spacing(2),
  },
  aboutBox: {
    display: "flex",
    flexShrink: 0,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  halfCenterBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  descriptionRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(12),
  },
  sourceLink: {
    textAlign: "right",
  },
  bottom: {
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
 * @param teaData {Object} Track the input state
 * @param handleEdit {function} Handle state edits
 */
export default function DetailsLayout({ teaData, handleEdit, setRouter }) {
  const classes = useStyles();
  const categories = useContext(CategoriesState);

  const [gongfu, setGongfu] = useState(true);
  const [notesEditing, setNotesEditing] = useState(false);
  const [notes, setNotes] = useState(teaData.notes ? teaData.notes : "");

  const category = Object.entries(categories).find(
    (entry) => entry[1].id === teaData.category
  )[1];

  const categoryName =
    category.name.charAt(0) + category.name.slice(1).toLowerCase();

  let coordinates;
  if (teaData.origin && teaData.origin.longitude && teaData.origin.latitude)
    coordinates = [teaData.origin.longitude, teaData.origin.latitude];

  let typeName = getSubcategoryName(teaData.subcategory);
  if (!typeName) typeName = categoryName;

  let descriptionName;
  let description;
  let descriptionSource;
  if (teaData.subcategory && teaData.subcategory.description) {
    descriptionName = teaData.subcategory.name;
    description = teaData.subcategory.description;
    descriptionSource = teaData.subcategory.descriptionSource;
  } else {
    descriptionName = categoryName + " Tea";
    description = category.description;
    descriptionSource = category.descriptionSource;
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

  function handleClose() {
    setRouter({ route: "MAIN" });
  }

  function handleEditClick() {
    setRouter({ route: "EDIT", data: teaData });
  }

  return (
    teaData && (
      <>
        <DialogContent className={classes.content}>
          <Box className={classes.row}>
            <img
              src={teaData.image ? teaData.image : emptyImage}
              alt=""
              className={classes.teaImage}
            />
            <Box className={classes.topBox}>
              <Box className={classes.column}>
                {teaData.vendor &&
                  (teaData.vendor.website ? (
                    <Link
                      href="#"
                      onClick={() =>
                        window.open(
                          "https://" + teaData.vendor.website,
                          "_blank"
                        )
                      }
                      variant="body2"
                      className={classes.vendor}
                    >
                      {teaData.vendor.name}
                    </Link>
                  ) : (
                    <Typography variant="body2" className={classes.vendor}>
                      {teaData.vendor.name}
                    </Typography>
                  ))}
                <Typography variant="h1" className={classes.title}>
                  {teaData.name}
                </Typography>
                <Typography variant="h2" className={classes.subtitle}>
                  {teaData.year} {typeName}
                </Typography>
              </Box>
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
          <Box className={classes.row}>
            <Paper className={classes.notesPaper}>
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
                  <Box className={classes.notesText}>
                    {notes.split("\n").map((s, key) => (
                      <Typography
                        variant="body2"
                        className={classes.rowCenter}
                        key={key}
                      >
                        {s}
                      </Typography>
                    ))}{" "}
                  </Box>
                )
              )}
              <Box className={classes.rowCenter}>
                {notesEditing ? (
                  <Button
                    className={classes.doubleMargin}
                    onClick={handleNotesSave}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    className={classes.doubleMargin}
                    onClick={() => setNotesEditing(true)}
                  >
                    {notes ? "Edit" : "Add"} notes
                  </Button>
                )}
              </Box>
            </Paper>
          </Box>
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
            {teaData.origin && (
              <Box className={classes.halfCenterBox}>
                <Typography variant="h4">Origin:</Typography>
                <Typography variant="h3" className={classes.doubleMargin}>
                  {getOriginName(teaData.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  style={{
                    width: "4em",
                    height: "4em",
                  }}
                  countryCode={getCountryCode(teaData.origin.country)}
                  alt=""
                  aria-label={teaData.origin.country}
                  className={classes.countryFlag}
                />
              </Box>
            )}
          </Box>
          {description && (
            <Box className={classes.descriptionRow}>
              <Box className={classes.aboutBox}>
                <Typography variant="h3">About {descriptionName}</Typography>
              </Box>
              <Box>
                {description.split("\n").map((s, key) => (
                  <Typography
                    variant="body2"
                    className={classes.rowCenter}
                    key={key}
                  >
                    {s}
                  </Typography>
                ))}
                {descriptionSource && (
                  <Typography className={classes.sourceLink}>
                    <Link
                      href="#"
                      onClick={() =>
                        window.open("https://" + descriptionSource, "_blank")
                      }
                      variant="body2"
                    >
                      View source
                    </Link>
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Button onClick={handleClose} aria-label="close">
            Close
          </Button>
          <Button onClick={handleEditClick} aria-label="edit">
            Edit
          </Button>
        </DialogActions>
      </>
    )
  );
}
