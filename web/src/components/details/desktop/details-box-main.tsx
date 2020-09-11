import React, {ReactElement, useContext, useState} from 'react';
import {
  Box,
  FormControlLabel,
  FormGroup,
  Link,
  Switch,
  Typography,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { Star } from "@material-ui/icons";
import InputBrewing from "../../input/mobile/input-brewing";
import { getSubcategoryName } from "../../../services/parsing-services";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import emptyImage from "../../../media/empty.png";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeaInstance, TeaRequest } from "../../../services/models";

/**
 * DetailsBoxMain props.
 *
 * @memberOf DetailsBoxMain
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Main box desktop tea instance details, contains name, year, subcategory, vendor,
 * rating and brewing info.
 *
 * @component
 * @subcategory Details desktop
 */
function DetailsBoxMain({ teaData, handleEdit }: Props): ReactElement {
  const classes = desktopDetailsStyles();
  const categories = useContext(CategoriesState);

  const [gongfu, setGongfu] = useState(true);
  const [rating, setRating] = useState(teaData.rating);

  const category = Object.values(categories).find(
    (value) => value.id === teaData.category
  );

  const categoryName = category
    ? category.name.charAt(0) + category.name.slice(1).toLowerCase()
    : "";

  const typeName = teaData.subcategory
    ? getSubcategoryName(teaData.subcategory)
    : categoryName;

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
                  window.open("https://" + teaData.vendor?.website, "_blank")
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
            <Typography variant="h1" className={classes.ratingNumber}>
              {rating ? rating / 2 : ""}
            </Typography>
            <Rating
              name="customized-empty"
              value={rating ? rating / 2 : 0}
              precision={0.5}
              size="large"
              onChange={(_, value) => handleRatingChange(value)}
              emptyIcon={<Star fontSize="inherit" />}
            />
          </Box>
          <Box className={classes.brewingBox}>
            <Box className={classes.brewingTitle}>
              <Typography variant="caption">Brewing suggestions:</Typography>
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
            <Box>
              <InputBrewing
                name={gongfu ? "gongfu" : "western"}
                teaData={teaData}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DetailsBoxMain;
