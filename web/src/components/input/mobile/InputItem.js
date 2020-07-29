import React from "react";
import { Box, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  nameBox: {
    width: theme.spacing(13),
  },
  valueBox: {
    display: "inline-block",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  noTitle: {
    textTransform: "none",
  },
}));

export default function InputItem({
  name,
  value,
  handleClick,
  noTitle = false,
}) {
  /**
   * Mobile tea creation layout list item.
   *
   * @param name {string} Item name
   * @param value {string} Item value
   * @param handleClick {function} Handles item click
   * @param noTitle {bool} If true value text capitalization is disabled
   */

  const classes = useStyles();
  const formListClasses = formListStyles();

  return (
    <ListItem
      button
      className={formListClasses.listItem}
      id={name}
      onClick={handleClick}
      aria-label={name}
    >
      <Box className={formListClasses.listItemBox}>
        <Box className={classes.nameBox}>
          <Typography variant={"body2"}>{name}</Typography>
        </Box>
        <Box className={classes.valueBox}>
          <Typography variant={"body2"} className={noTitle ? classes.noTitle : ""}>
            {value}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
}
