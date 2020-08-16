import React, { useContext } from "react";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { vendorModel } from '../../../services/Serializers';
import { VendorsState } from "../../statecontainers/VendorsContext";
import { Grid, Typography } from "@material-ui/core";
import { fade, makeStyles } from "@material-ui/core/styles";

const filter = createFilterOptions({
  stringify: (option) => option.name + " " + option.website,
});

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  listItem: {
    paddingBottom: theme.spacing(1),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  listItemName: {
    fontWeight: 400,
  },
}));

export default function VendorAutocomplete({
  teaData,
  setTeaData,
  renderInput,
}) {
  /**
   * Mobile tea creation subcategory input component. Shows a list and autocomplete from
   * central subcategories state, with option to add extra.
   * Updates category entry if different than ones in matching subcategory.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleBackToLayout {function} Reroutes to input layout
   */
  const classes = useStyles();

  const vendors = useContext(VendorsState);

  function updateVendor(name) {
    if (name) {
      // If input already exist add the object, otherwise add only the name
      const match = Object.entries(vendors).find(
        (entry) => entry[1].name === name
      );
      if (match) setTeaData({ ...teaData, vendor: match[1] });
      else setTeaData({ ...teaData, vendor: { name: name } });
    } else setTeaData({ ...teaData, vendor: vendorModel });
  }

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      updateVendor(newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      updateVendor(newValue.inputValue);
    } else {
      updateVendor(newValue);
    }
  }

  return (
    <Autocomplete
      id="vendor"
      onChange={handleOnChange}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        // Suggest the creation of a new value
        if (params.inputValue !== "") {
          filtered.push({
            inputValue: params.inputValue,
            label: `Add "${params.inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      fullWidth
      freeSolo
      options={vendors ? vendors : []}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.name;
      }}
      renderInput={renderInput}
      renderOption={(option) => {
        return (
          <Grid container alignItems="center">
            <Grid item xs className={classes.listItem}>
              <span className={classes.listItemName}>
                {option.inputValue ? option.label : option.name}
              </span>
              <Typography variant="body2" color="textSecondary">
                {option.website ? option.website : ""}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}