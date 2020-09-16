import React, { MouseEvent, ReactElement } from "react";
import { Box, IconButton, ListItem, Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../../style/form-list-styles";
import { Clear } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100vw",
  },
  nameBox: {
    display: "flex",
    minWidth: theme.spacing(13),
    maxWidth: theme.spacing(13),
  },
  listItem: {
    paddingRight: 0,
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
  clear: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(1),
    paddingRight: 0,
    marginRight: theme.spacing(2),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
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
  /** Handles clear icon click */
  handleClear?: (event: MouseEvent) => void;
  /** If true value text capitalization is disabled */
  noTitle?: boolean;
  /** If true value bottom border is disabled */
  noBorder?: boolean;
};

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
  handleClear,
  noTitle,
  noBorder,
}: Props): ReactElement {
  const classes = useStyles();
  const formListClasses = formListStyles();

  return (
    <Box className={classes.root}>
      <ListItem
        button
        className={formListClasses.listItem}
        id={name}
        onClick={handleClick}
        aria-label={name}
        style={value ? { paddingRight: 0 } : {}}
      >
        <Box
          className={formListClasses.listItemBox}
          style={noBorder ? { border: 0 } : undefined}
        >
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
      {value && handleClear && (
        <Box className={classes.clear}>
          <IconButton size="small" id={name} onClick={handleClear}>
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

export default InputItem;
