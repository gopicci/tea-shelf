import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  IconButton,
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
} from "../services/ParsingService";
import ReactCountryFlag from "react-country-flag";
import InputBrewing from "./create/InputBrewing";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  barMain: {
    flexGrow: 1,
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
    minHeight: "100%",
    background: theme.palette.background.main,
  },
  card: {
    display: "flex",
    flexDirection: "column",
    borderRadius: 0,
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  empty: {
    display: "flex",
    flexDirection: "column-reverse",
    alignItems: "flex-end",
    minHeight: theme.spacing(10),
    background: theme.palette.background.main,
  },
  editButton: {
    color: theme.palette.primary.main,
  },
  pageTop: {
    display: "flex",
    flexDirection: "row",
  },
  teaImage: {
    minWidth: theme.spacing(14),
    maxWidth: theme.spacing(14),
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
    paddingBottom: theme.spacing(4),
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(1),
    marginTop: theme.spacing(1),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  starRating: {
    display: 'flex',
    justifyContent: "center",
    flexGrow: 1,
  },
  brewingTitle: {
    flexGrow: 1,
    textAlign: "left",
  },
  brewing: {
    flexGrow: 1,
    marginBottom: theme.spacing(16),
  },
  notesBox: {
    display: "flex",
    flexGrow: 1,
    minHeight: theme.spacing(16),
    paddingBottom: theme.spacing(2),
  },
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
}));

export default function TeaDetails({ setRoute, tea }) {
  /**
   * Mobile tea entry creation process. Consists of 3 stages:
   * captureImage -> inputLayout -> handleCreate
   *
   * teaData tracks the input state.
   *
   * @param setRoute {function} Set main route
   */

  const classes = useStyles();

  const [gongfu, setGongfu] = useState(true);

  function handleBack() {
    setRoute({ route: "MAIN" });
  }

  function handleRatingChange(event, value) {
    console.log(value);
  }

  function handleSwitch() {
    setGongfu(!gongfu);
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Box className={classes.barMain}>
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
          <IconButton edge="start" color="inherit" aria-label="back">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
      {tea && (
        <Box className={classes.page}>
          <Card className={classes.card}>
            <Box className={classes.empty}>
              <Button
                className={classes.editButton}
                size="small"
                endIcon={<Edit />}
              >
                Edit
              </Button>
            </Box>
            <Box className={classes.pageTop}>
              <img
                src={tea.image ? tea.image : emptyImage}
                alt=""
                className={classes.teaImage}
              />
              <Box className={classes.center}>
                <Typography variant="h1">{tea.name}</Typography>
              </Box>
            </Box>
            <Box className={classes.generic}>
              <Typography variant="h2">
                {tea.year} {getSubcategoryName(tea.subcategory)}
              </Typography>
            </Box>
            <Box className={classes.divider} />
            <Box className={classes.generic}>
              <Typography variant="caption">
                Rating:
              </Typography>
              <Rating
                name="customized-empty"
                className={classes.starRating}
                defaultValue={0}
                precision={0.5}
                size="large"
                onChange={handleRatingChange}
                emptyIcon={<Star fontSize="inherit" />}
              />
            </Box>
            <Box className={classes.divider} />

            <Box className={classes.generic}>
              <Box className={classes.row}>
              <Typography
                variant="caption"
                className={classes.brewingTitle}
                component="span"
              >
                Brewing instructions:
              </Typography>
              <FormGroup>
                <FormControlLabel
                  value="start"
                  control={<Switch size="small" color="default" />}
                  label={gongfu ? "Gongfu" : "Western"}
                  labelPlacement="start"
                  onChange={handleSwitch}
                />
              </FormGroup>
              </Box>
              <Box className={classes.brewing}>
                <InputBrewing
                  name={gongfu ? "gongfu" : "western"}
                  teaData={tea}
                  handleClick={null}
                />
              </Box>
            </Box>
            {tea.weight_left > 0 && (
              <Typography variant="caption">
                Weight left: {tea.weight_left}
              </Typography>
            )}
            {tea.price > 0 && (
              <Typography variant="caption">
                Price: {tea.weight_left}
              </Typography>
            )}
          </Card>
          <Card className={classes.card}>
            <Box className={classes.generic}>
              <Typography variant="caption" display="block">
                Notes:
              </Typography>
              <Box className={classes.notesBox}>
                <Typography variant="caption" className={classes.center}>
                  {tea.notes ? tea.notes : <Button>Add notes</Button>}
                </Typography>
              </Box>
            </Box>
          </Card>
          {tea.origin && (
            <Card className={classes.card}>
              <Box className={classes.generic}>
                <Typography variant="caption" display="block">
                  Origin:
                </Typography>
                <Typography variant="body2">
                  {getOriginName(tea.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  style={{
                    width: "2em",
                    height: "2em",
                  }}
                  className={classes.countryFlag}
                  countryCode={getCountryCode(tea.origin.country)}
                  aria-label={tea.origin.country}
                />
              </Box>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
}
