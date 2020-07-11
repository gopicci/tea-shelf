import React from "react";
import {
  Checkbox,
  FormControlLabel,
  ListItem,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Check } from "@material-ui/icons";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  checkbox: {
    flexGrow: 1,
    textAlign: "right",
  },
  checkIcon: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginTop: -theme.spacing(3),
    marginBottom: -theme.spacing(3),
  },
}));

export default function CheckBoxListItem({ name, checked, handleChange }) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  return (
    <ListItem className={formListClasses.listItem} key={name} button>
      <FormControlLabel
        labelPlacement="start"
        className={formListClasses.listItemBox}
        control={
          <div className={classes.checkbox}>
            <Checkbox
              checked={checked}
              onChange={handleChange}
              name={name}
              checkedIcon={<Check className={classes.checkIcon} />}
              icon={<Check className={classes.checkIcon} visibility="hidden" />}
            />
          </div>
        }
        label={<Typography variant={"body2"}>{name}</Typography>}
      />
    </ListItem>
  );
}
