import React, { useContext } from "react";
import { Box, Card, Link, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { detailsMobileStyles } from "../../../style/DetailsMobileStyles";
import { CategoriesState } from "../../statecontainers/categories-context";

const useStyles = makeStyles((theme) => ({
  about: {
    marginBottom: theme.spacing(1),
  },
}));

/**
 * Mobile tea details page description card.
 *
 * @param teaData {Object} Track the input state
 */
export default function DetailsCardDescription({ teaData }) {
  const classes = useStyles();
  const detailsClasses = detailsMobileStyles();
  const categories = useContext(CategoriesState);

  const category = Object.entries(categories).find(
    (entry) => entry[1].id === teaData.category
  )[1];

  const categoryName =
    category.name.charAt(0) + category.name.slice(1).toLowerCase();

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

  return (
    <Card className={detailsClasses.card}>
      <Box className={detailsClasses.genericBox}>
        <Typography variant="caption" display="block" className={classes.about}>
          About {descriptionName}:
        </Typography>
        {description.split("\n").map((s, key) => (
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
