import React, { ReactElement, useContext } from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { MenuBook } from "@material-ui/icons";
import { getCategoryName } from "../../../services/parsing-services";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeaInstance } from "../../../services/models";

/**
 * DetailsCardDescription props.
 *
 * @memberOf DetailsCardDescription
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
};

/**
 * Mobile tea details page description card.
 *
 * @component
 * @subcategory Details mobile
 */
function DetailsCardDescription({ teaData }: Props): ReactElement {
  const classes = mobileDetailsStyles();

  const categories = useContext(CategoriesState);

  const category = Object.values(categories).find(
    (value) => value.id === teaData.category
  );

  let descriptionName = "";
  let description = "";
  let descriptionSource = "";

  if (teaData.subcategory && teaData.subcategory.description) {
    descriptionName = teaData.subcategory.name;
    description = teaData.subcategory.description;
    if (teaData.subcategory.description_source)
      descriptionSource = teaData.subcategory.description_source;
  } else if (category && category.description && category.description_source) {
    descriptionName = getCategoryName(categories, teaData.category) + " Tea";
    description = category.description;
    if (category.description_source)
      descriptionSource = category.description_source;
  }

  return description ? (
    <Card className={classes.card} variant="outlined">
      <Box className={classes.genericBox}>
        <Box className={classes.titleBox}>
          <MenuBook className={classes.titleIcon} />
          <Typography variant="h5">About {descriptionName}:</Typography>
        </Box>

        {description &&
          description.split("\n").map((s, key) => (
            <Typography variant="body2" key={key}>
              {s}
            </Typography>
          ))}
        {descriptionSource && (
          <Link
            href="#"
            onClick={() =>
              window.open("https://" + descriptionSource, "_blank")
            }
            variant="body2"
            className={classes.source}
          >
            View source
          </Link>
        )}
      </Box>
    </Card>
  ) : (
    <></>
  );
}

export default DetailsCardDescription;
