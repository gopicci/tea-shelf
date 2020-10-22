import React, { ReactElement, useContext } from "react";
import { TeaInstance } from "../../../services/models";
import { Box, Link, Typography } from "@material-ui/core";
import { MenuBook } from "@material-ui/icons";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import { CategoriesState } from "../../statecontainers/categories-context";

/**
 * DetailsBoxDescription props.
 *
 * @memberOf DetailsBoxDescription
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
};

/**
 * Desktop details page description box.
 *
 * @component
 * @subcategory Details desktop
 */
function DetailsBoxDescription({ teaData }: Props): ReactElement {
  const classes = desktopDetailsStyles();
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
    descriptionName =
      category.name.charAt(0) + category.name.slice(1).toLowerCase() + " Tea";
    description = category.description;
    if (category.description_source)
      descriptionSource = category.description_source;
  }

  return (
    <>
      <Box className={classes.descriptionRow}>
        <Box className={classes.aboutBox}>
          <MenuBook className={classes.icon} />
          <Typography variant="h3">About {descriptionName}</Typography>
        </Box>
        <Box>
          {description.split("\n").map((s, key) => (
            <Typography variant="body2" className={classes.rowCenter} key={key}>
              {s}
            </Typography>
          ))}
        </Box>
      </Box>
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
    </>
  );
}

export default DetailsBoxDescription;
