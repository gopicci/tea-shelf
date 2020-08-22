import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  FormControlLabel,
  FormGroup,
  Switch,
  Typography,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Edit, Star } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  cropToNoZeroes,
  getSubcategoryName,
} from "../../../services/ParsingService";
import InputBrewing from "../../input/mobile/InputBrewing";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";
import emptyImage from "../../../media/empty.png";

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
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
  brewingTitle: {
    flexGrow: 1,
    textAlign: "left",
    margin: "auto",
  },
  brewing: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
}));

/**
 * Mobile tea details page main card. Contains image, title, rating,
 * brewing instructions, weight, price.
 *
 * @param setRouter {function} Set main route
 * @param teaData {Object} Track the input state
 * @param handleEdit {function} Handle state edits
 */
export default function DetailsCardMain({ teaData, setRouter, handleEdit }) {
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();

  const [gongfu, setGongfu] = useState(true);

  function handleRatingChange(_, value) {
    handleEdit({ ...teaData, rating: value * 2 });
  }

  function handleEditClick() {
    setRouter({ route: "EDIT", data: teaData });
  }

  function handleSwitch() {
    setGongfu(!gongfu);
  }

  return (
    <Card className={detailsClasses.card}>
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
        <Box className={detailsClasses.center}>
          <Typography variant="h1">{teaData.name}</Typography>
        </Box>
      </Box>
      <Box className={detailsClasses.genericBox}>
        <Typography variant="h2">
          {teaData.year} {getSubcategoryName(teaData.subcategory)}
        </Typography>
      </Box>
      <Box className={detailsClasses.divider} />
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption">Rating:</Typography>
        <Box className={detailsClasses.grow}>
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
      <Box className={detailsClasses.divider} />
      <Box className={detailsClasses.genericBox}>
        <Box className={detailsClasses.row}>
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
          <Box className={detailsClasses.divider} />
          <Box className={detailsClasses.genericBox}>
            <Box className={detailsClasses.row}>
              {teaData.weight_left > 0 && (
                <Typography
                  variant="caption"
                  className={detailsClasses.centerGrow}
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
                  className={detailsClasses.centerGrow}
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
  );
}
