import React, { useState, useEffect, useContext } from "react";
import {
  InputAdornment,
  TextField,
  Typography,
  Box,
  IconButton,
  FormGroup,
  FormLabel,
  List,
  ListItem,
} from "@material-ui/core";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import { ArrowBack } from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import { formListStyles } from "../../style/FormListStyles";

import { VendorsState } from '../statecontainers/VendorsContext';

const filter = createFilterOptions();

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  textField: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  listItem: {
    paddingBottom: theme.spacing(1),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
}));

export default function EditVendor(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const vendors = useContext(VendorsState);

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(null);

  useEffect(() => {
    setOptions(
      Object.entries(vendors).map((entry) => {
        return entry[1].name;
      })
    );
  }, [vendors]);

  function handleListSelect(event) {
    const item = Object.entries(vendors).find(
      (entry) => entry[1].name === event.currentTarget.id
    );
    props.setTeaData({
      ...props.teaData,
      [props.field]: { name: item[1].name },
    });
    props.handleBackToLayout();
  }

  useEffect(() => {
    if (value) {
      const item = Object.entries(vendors).find(
        (entry) => entry[1].name === value
      );
      if (item)
        props.setTeaData({
          ...props.teaData,
          [props.field]: { name: item[1].name },
        });
      else
        props.setTeaData({ ...props.teaData, [props.field]: { name: value } });
      props.handleBackToLayout();
    }
  }, [value]);

  return (
    <Box className={classes.root}>
      {options && (
        <Autocomplete
          value={value}
          onChange={(event, newValue) => {
            if (typeof newValue === "string") {
              setValue(newValue);
            } else if (newValue && newValue.inputValue) {
              // Create a new value from the user input
              setValue(newValue.inputValue);
            } else {
              setValue(newValue);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
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
          open={inputValue !== ""}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          id="vendor-autocomplete"
          options={options}
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
            return option;
          }}
          renderOption={(option) => (option.inputValue ? option.label : option)}
          freeSolo
          ListboxProps={{ style: { maxHeight: "60vh" } }}
          PaperComponent={({ children }) => <Box>{children}</Box>}
          renderInput={(params) => (
            <TextField
              {...params}
              className={classes.textField}
              variant="outlined"
              placeholder="Search vendor"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={props.handleBackToLayout}
                      edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="back"
                    >
                      <ArrowBack />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
      )}
      {!inputValue && (
        <FormGroup>
          <FormLabel className={formListClasses.formLabel}>
            <Typography className={formListClasses.formLabelText}>
              Popular vendors
            </Typography>
          </FormLabel>
          <List className={formListClasses.list}>
            {options &&
              options.map((option) => (
                <ListItem
                  button
                  className={formListClasses.listItem}
                  key={option}
                  id={option}
                  onClick={handleListSelect}
                >
                  <Box className={formListClasses.listItemBox}>
                    <Typography variant={"body2"}>{option}</Typography>
                  </Box>
                </ListItem>
              ))}
          </List>
        </FormGroup>
      )}
    </Box>
  );
}