import React, { ReactElement, useState } from "react";
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
import { Star } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import {
  cropToNoZeroes,
  getSubcategoryName,
} from "../../../services/parsing-services";
import InputBrewing from "../../input/mobile/input-brewing";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import emptyImage from "../../../media/empty.png";
import { Route } from "../../../app";
import { TeaInstance, TeaRequest } from "../../../services/models";

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
    background: theme.palette.background.default,
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
 * DetailsCardMain props.
 *
 * @memberOf DetailsCardMain
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Mobile tea details page main card. Contains image, title, rating,
 * brewing instructions, weight, price.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsCardMain({ teaData, handleEdit }: Props): ReactElement {
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

  const [rating, setRating] = useState(teaData?.rating);
  const [gongfu, setGongfu] = useState(true);

  /**
   * Updates tea instance rating. API rating range is 0 to 10.
   *
   * @param {number} value - Star rating
   */
  function handleRatingChange(value: number | null): void {
    handleEdit(
      { ...teaData, rating: value ? value * 2 : undefined },
      teaData.id
    );
    setRating(value ? value * 2 : undefined);
  }

  /** Updates brewing switch state. */
  function handleSwitch(): void {
    setGongfu(!gongfu);
  }

  return (
    <Card className={detailsClasses.card}>
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
          {teaData.year}{" "}
          {teaData.subcategory && getSubcategoryName(teaData.subcategory)}
        </Typography>
      </Box>
      <Box className={detailsClasses.divider} />
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption">Rating:</Typography>
        <Box className={detailsClasses.grow}>
          <Rating
            name="customized-empty"
            value={rating ? rating / 2 : 0}
            precision={0.5}
            size="large"
            onChange={(_, value) => handleRatingChange(value)}
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
          />
        </Box>
      </Box>
      {!!(teaData.weight_left || teaData.price) && (
        <>
          <Box className={detailsClasses.divider} />
          <Box className={detailsClasses.genericBox}>
            <Box className={detailsClasses.row}>
              {teaData.weight_left && (
                <Typography
                  variant="caption"
                  className={detailsClasses.centerGrow}
                >
                  Weight left:{" "}
                  {cropToNoZeroes(teaData.weight_left) +
                    "g (" +
                    cropToNoZeroes(teaData.weight_left / 28.35, 2) +
                    "oz)"}
                </Typography>
              )}
              {teaData.price && (
                <Typography
                  variant="caption"
                  className={detailsClasses.centerGrow}
                >
                  Price:{" "}
                  {cropToNoZeroes(teaData.price) +
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

export default DetailsCardMain;
