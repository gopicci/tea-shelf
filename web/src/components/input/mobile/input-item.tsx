import React, { MouseEvent, ReactElement } from "react";
import { Box, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../../style/form-list-styles";

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

/**
 * InputItem props.
 * 
 * @memberOf InputItem
 */
type Props = {
  /** Item name */
  name: string;
  /** Item value */
  value: string;
  /** Handles item click */
  handleClick: (event: MouseEvent) => void;
  /** If true value text capitalization is disabled */
  noTitle?: boolean;
}

/**
 * Mobile tea editing layout list item.
 *
 * @component
 * @subcategory Mobile input
 */
function InputItem({
  name,
  value,
  handleClick,
  noTitle = false,
}: Props): ReactElement {
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
          <Typography
            variant={"body2"}
            className={noTitle ? classes.noTitle : ""}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </ListItem>
  );
}

export default InputItem;
