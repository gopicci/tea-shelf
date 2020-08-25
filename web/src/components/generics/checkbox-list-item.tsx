import React, { ChangeEvent, ReactElement } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  ListItem,
  Typography,
} from "@material-ui/core";
import { Check } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  label: {
    flexGrow: 1,
    margin: 0,
    "& .MuiFormControlLabel-label": {
      flexGrow: 1,
    },
  },
  labelTypography: {
    flexGrow: 1,
    textTransform: "capitalize",
    display: "flex",
  },
  checkbox: {
    margin: -theme.spacing(1),
  },
  checkIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
}));

/**
 * CheckboxListItem props.
 *
 * @memberOf CheckboxListItem
 */
type Props = {
  /** Item name */
  name: string;
  /** Checked status */
  checked: boolean;
  /** Changes checked status */
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Single item of a checkbox list.
 *
 * @component
 */
function CheckboxListItem({
  name,
  checked,
  handleChange,
}: Props): ReactElement {
  const classes = useStyles();
  const formListClasses = formListStyles();

  return (
    <ListItem className={formListClasses.listItem} key={name} button>
      <Box className={formListClasses.listItemBox}>
        <FormControlLabel
          labelPlacement="start"
          className={classes.label}
          control={
            <Checkbox
              className={classes.checkbox}
              checked={checked}
              onChange={handleChange}
              name={name}
              checkedIcon={<Check className={classes.checkIcon} />}
              icon={<Check className={classes.checkIcon} visibility="hidden" />}
            />
          }
          label={
            <Typography variant="body2" className={classes.labelTypography}>
              {name}
            </Typography>
          }
        />
      </Box>
    </ListItem>
  );
}

export default CheckboxListItem;
