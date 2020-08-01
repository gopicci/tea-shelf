import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActionArea,
  FormControlLabel,
  FormGroup,
  IconButton,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { Edit, Star } from "@material-ui/icons";
import { ArrowBack, MoreVert } from "@material-ui/icons";
import emptyImage from "../dev/empty.png";
import {
  getSubcategoryName,
  getOriginName,
  getCountryCode,
  cropToNoZeroes,
} from "../services/ParsingService";
import ReactCountryFlag from "react-country-flag";
import InputBrewing from "./input/mobile/InputBrewing";
import { APIRequest } from "../services/AuthService";
import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { TeaDispatch } from "./statecontainers/TeasContext";
import localforage from "localforage";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    flexShrink: 0,
    background: theme.palette.background.main,
  },
  card: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    borderRadius: 0,
    marginBottom: theme.spacing(2),
  },
  empty: {
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "flex-end",
    minHeight: theme.spacing(10),
    background: theme.palette.background.main,
    paddingRight: theme.spacing(1),
  },
  editButton: {
    color: theme.palette.primary.main,
  },
  pageTop: {
    display: "flex",
    flexDirection: "row",
    paddingRight: theme.spacing(2),
  },
  teaImage: {
    minWidth: theme.spacing(14),
    maxWidth: theme.spacing(14),
    minHeight: theme.spacing(18),
    maxHeight: theme.spacing(18),
    objectFit: "cover",
    margin: theme.spacing(2),
    marginBottom: 0,
    marginTop: -theme.spacing(5),
    borderRadius: theme.spacing(0.75),
    border: `solid 2px ${theme.palette.background.default}`,
  },
  center: {
    margin: "auto",
  },
  generic: {
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(1),
    marginTop: theme.spacing(1),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  brewingTitle: {
    flexGrow: 1,
    textAlign: "left",
    margin: "auto",
  },
  grow: {
    flexGrow: 1,
  },
  centerGrow: {
    flexGrow: 1,
    textAlign: "center",
  },
  brewing: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  notesBox: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    minHeight: theme.spacing(16),
    paddingBottom: theme.spacing(2),
  },
  notes: {
    textAlign: "left",
  },
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
}));

export default function TeaDetails({ setRoute, teaData, handleEdit }) {
  /**
   * Mobile tea entry creation process. Consists of 3 stages:
   * captureImage -> inputLayout -> handleCreate
   *
   *
   * @param setRoute {function} Set main route
   * @param teaData {json} Track the input state
   * @param handleEdit {function} Handle state edits
   */

  const classes = useStyles();
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);

  const [gongfu, setGongfu] = useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleMenuClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenuClose() {
    setAnchorEl(null);
  }

  async function handleDelete() {
    try {
      if (String(teaData.id).length > 5)
        // Delete online tea
        await APIRequest(`/tea/${teaData.id}/`, "DELETE");
      else {
        // Delete offline tea
        const offlineTeas = await localforage.getItem("offline-teas");
        let newOfflineTeas = [];
        for (const tea of offlineTeas)
          if (tea.id !== teaData.id) newOfflineTeas.push(tea);
        await localforage.setItem("offline-teas", newOfflineTeas);
      }
      setRoute({ route: "MAIN" });
      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully deleted" });
      teaDispatch({ type: "DELETE", data: teaData });
    } catch (e) {
      console.error(e);
      snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
    }
  }

  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  function handleRatingChange(_, value) {
    handleEdit({ ...teaData, rating: value * 2 });
  }

  function handleEditClick() {
    setRoute({ route: "EDIT", data: teaData });
  }

  function handleEditNotes() {
    setRoute({ route: "EDIT_NOTES", data: teaData });
  }

  function handleSwitch() {
    setGongfu(!gongfu);
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Box className={classes.grow}>
            <IconButton
              onClick={handleBack}
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="back"
            >
              <ArrowBack />
            </IconButton>
          </Box>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Archive</MenuItem>
            <MenuItem onClick={handleDelete}>Delete</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      {teaData && (
        <Box className={classes.page}>
          <Card className={classes.card}>
            <Box className={classes.empty}>
              <Button
                className={classes.editButton}
                size="small"
                endIcon={<Edit />}
                onClick={handleEditClick}
                aria-label="edit"
              >
                Edit
              </Button>
            </Box>
            <Box className={classes.pageTop}>
              <img
                src={teaData.image ? teaData.image : emptyImage}
                alt=""
                className={classes.teaImage}
              />
              <Box className={classes.center}>
                <Typography variant="h1">{teaData.name}</Typography>
              </Box>
            </Box>
            <Box className={classes.generic}>
              <Typography variant="h2">
                {teaData.year} {getSubcategoryName(teaData.subcategory)}
              </Typography>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.generic}>
              <Typography variant="caption">Rating:</Typography>
              <Box className={classes.grow}>
                <Rating
                  name="customized-empty"
                  value={teaData.rating / 2 || 0}
                  precision={0.5}
                  size="large"
                  onChange={handleRatingChange}
                  emptyIcon={<Star fontSize="inherit" />}
                />
              </Box>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.generic}>
              <Box className={classes.row}>
                <Typography variant="caption" className={classes.brewingTitle}>
                  Brewing instructions:
                </Typography>
                <FormGroup>
                  <FormControlLabel
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
            {(teaData.weight_left > 0 || teaData.price > 0) && (
              <>
                <Box className={classes.divider} />
                <Box className={classes.generic}>
                  <Box className={classes.row}>
                    {teaData.weight_left > 0 && (
                      <Typography
                        variant="caption"
                        className={classes.centerGrow}
                      >
                        Weight left:{" "}
                        {teaData.weight_left +
                          "g (" +
                          cropToNoZeroes(teaData.weight_left / 28.35, 2) +
                          "oz)"}
                      </Typography>
                    )}
                    {teaData.price > 0 && (
                      <Typography
                        variant="caption"
                        className={classes.centerGrow}
                      >
                        Price:{" "}
                        {teaData.price +
                          "/g (" +
                          cropToNoZeroes(teaData.price * 28.35, 1) +
                          "/oz)"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </>
            )}
          </Card>
          <Card className={classes.card}>
            <CardActionArea onClick={handleEditNotes} aria-label="Edit notes">
              <Box className={classes.generic}>
                <Typography variant="caption" display="block">
                  {teaData.notes && "Edit notes:"}
                </Typography>

                {!teaData.notes ? (
                  <Typography variant="caption" className={classes.center}>
                    <Button>Add notes</Button>
                  </Typography>
                ) : (
                  <Box className={classes.notesBox}>
                    {teaData.notes.split("\n").map((s, key) => (
                      <Typography
                        variant="body1"
                        className={classes.notes}
                        key={key}
                      >
                        {s}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
            </CardActionArea>
          </Card>
          {teaData.origin && (
            <Card className={classes.card}>
              <Box className={classes.generic}>
                <Typography variant="caption" display="block">
                  Origin:
                </Typography>
                <Typography variant="body2">
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
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}
