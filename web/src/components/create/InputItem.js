import React from "react";
import { Box, ListItem, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

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

export default function InputItem({ name, value, handleClick, noTitle=false }) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  return (
    <ListItem
      button
      className={formListClasses.listItem}
      id={name}
      onClick={handleClick}
    >
      <Box className={formListClasses.listItemBox}>
        <Box className={classes.nameBox}>
          <Typography variant={"body2"}>{name}</Typography>
        </Box>
        <Box className={classes.valueBox}>
          <Typography variant={"body2"} className={noTitle && classes.noTitle}>{value}</Typography>
        </Box>
      </Box>
    </ListItem>
  );
}
