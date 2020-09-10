import React, { ReactElement, useContext } from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { mobileDetailsStyles } from "../../../style/mobile-details-styles";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeaInstance } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  about: {
    marginBottom: theme.spacing(1),
  },
}));

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
  const classes = useStyles();
  const detailsClasses = mobileDetailsStyles();

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
    descriptionName = category.name.charAt(0) + category.name.slice(1).toLowerCase() + " Tea";
    description = category.description;
    if (category.description_source)
      descriptionSource = category.description_source;
  }

  return (
    <Card className={detailsClasses.card} variant="outlined">
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block" className={classes.about}>
          About {descriptionName}:
        </Typography>
        {description && description.split("\n").map((s, key) => (
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
          >
            View source
          </Link>
        )}
      </Box>
    </Card>
  );
}

export default DetailsCardDescription;
