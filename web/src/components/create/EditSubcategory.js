import React, {useState, useEffect} from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Button,
  IconButton, FormGroup, FormLabel, List, ListItem,
} from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { ArrowBack, LocationOn } from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import {formListStyles} from '../../style/FormListStyles';

import {subcategories} from '../../dev/DevData';

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

export default function EditSubcategory(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  const [value, setValue] = useState('');
  const [inputValue, setInputValue] = useState('');

  function handleListSelect(event) {
    props.setData({ ...props.data, [props.field]: event.currentTarget.id });
    props.handleBackToLayout();
  }

  useEffect(() => {
    if (value) {
      props.setData({ ...props.data, [props.field]: value });
      props.handleBackToLayout();
    }
  }, [value])

  return (
    <Box className={classes.root}>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
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
          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              label: `Add "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        open={inputValue !== ''}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        id="free-solo-with-text-demo"
        options={subcategories}
        getOptionLabel={(option) => {
          // Value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          // Add "xxx" option created dynamically
          if (option.inputValue) {
            return option.inputValue;
          }
          // Regular option
          return option;
        }}
        renderOption={(option) => option.inputValue ? option.label : option }
        freeSolo
        ListboxProps={{ style: { maxHeight: "60vh" } }}
        PaperComponent={({ children }) => <Box>{children}</Box>}
        renderInput={(params) => (
          <TextField
            {...params}
            className={classes.textField}
            variant="outlined"
            placeholder="Search subcategory"
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
      {!inputValue &&
      <FormGroup>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.formLabelText}>
            Popular subcategories
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
        {
          subcategories.map(subcategory => (
            <ListItem
              button
              className={formListClasses.listItem}
              key={subcategory}
              id={subcategory}
              onClick={handleListSelect}
            >
              <Box className={formListClasses.listItemBox}>
                  <Typography variant={"body2"}>{subcategory}</Typography>
              </Box>
            </ListItem>
          ))
        }
        </List>
      </FormGroup>}
    </Box>
  );
}

