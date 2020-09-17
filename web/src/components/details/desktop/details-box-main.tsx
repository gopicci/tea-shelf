import React, { ReactElement, useContext, useState } from "react";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Icon,
  Link,
  SvgIcon,
  Switch,
  Typography,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { CreditCard, FitnessCenter, Star } from "@material-ui/icons";
import InputBrewing from "../../input/mobile/input-brewing";
import {
  cropToNoZeroes,
  getSubcategoryName,
} from "../../../services/parsing-services";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import emptyImage from "../../../media/empty.png";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SettingsState } from "../../statecontainers/settings-context";
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

  const settings = useContext(SettingsState);
  const categories = useContext(CategoriesState);

  const [gongfu, setGongfu] = useState(settings.gongfu);
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
          <Box className={classes.column}>
            <Box className={classes.ratingBox}>
              <Typography variant="h1" className={classes.ratingNumber}>
                {rating ? rating / 2 : ""}
              </Typography>
              <Rating
                className={classes.rating}
                name="customized-empty"
                value={rating ? rating / 2 : 0}
                precision={0.5}
                size="large"
                onChange={(_, value) => handleRatingChange(value)}
                emptyIcon={<Star fontSize="inherit" />}
              />
            </Box>
            <Box>
              {!!teaData.weight_left && (
                <Box className={classes.label}>
                  <FitnessCenter className={classes.lineIcon} />
                  <Typography variant="caption">
                    Weight left:{" "}
                    {settings.metric
                      ? cropToNoZeroes(teaData.weight_left) + "g"
                      : cropToNoZeroes(teaData.weight_left / 28.35, 2) + "oz"}
                  </Typography>
                </Box>
              )}
              {!!teaData.price && (
                <Box className={classes.label}>
                  <CreditCard className={classes.lineIcon} />
                  <Typography variant="caption">
                    Price:{" "}
                    {settings.metric
                      ? cropToNoZeroes(teaData.price, 1) + "/g"
                      : cropToNoZeroes(teaData.price * 28.35, 1) + "/oz"}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box className={classes.brewingBox}>
            <Box className={classes.row}>
              <Icon className={classes.icon}>
                <SvgIcon
                  shapeRendering="geometricPrecision"
                  viewBox="0 0 341.8 341.8"
                >
                  <path d="M137 92l4 1a6 6 0 005-7c-3-12-1-22 4-28 6-9 9-20 7-30-1-8-6-16-13-21h-7c-2 2-3 4-2 6 3 13 0 21-6 32-5 8-7 17-5 25 1 9 6 17 13 22zM186 88l3 1a5 5 0 005-7c-2-8-1-15 3-19 5-7 7-15 5-23-1-7-4-12-10-16h-6c-2 1-3 4-2 6 2 8 0 14-5 22-3 6-5 13-4 19 1 7 5 13 11 17zM89 88l3 1a5 5 0 005-7c-1-8-1-15 3-19 5-7 7-15 6-23-1-7-5-12-11-16h-6c-2 1-3 4-2 6 2 8 0 14-5 22-3 6-4 13-3 19 1 7 4 13 10 17zM291 134c-6 0-15 1-24 7l-1-3h-1c-1-3-4-9-16-9H30c-4 0-11 1-15 10a146 146 0 0064 193c1 0 8 4 15 4h94c6 0 12-3 13-4 22-11 40-27 54-46h6c15 0 35-9 51-24 19-18 30-43 30-69 0-32-23-59-51-59zm-19 120a143 143 0 006-81c5-9 10-9 13-9 11 0 21 14 21 29 0 34-25 54-40 61z" />
                </SvgIcon>
              </Icon>
            </Box>
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
