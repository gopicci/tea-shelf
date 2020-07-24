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

import {brewingTimesToSeconds, getSubcategoryName} from '../../services/ParsingService';

import { SubcategoriesState } from "../statecontainers/SubcategoriesContext";

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

  const subcategories = useContext(SubcategoriesState);

  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState(null);

  useEffect(() => {
    setOptions(
      Object.entries(subcategories).map((entry) => {
        return getSubcategoryName(entry[1]);
      })
    );
  }, [subcategories]);

  function defineTeaData(subcategory){
    let data = {
      ...props.teaData,
      subcategory: { name: subcategory.name },
      category: subcategory.category,
    }
    if (subcategory.western_brewing)
      data = {
      ...data,
        western_brewing: brewingTimesToSeconds(subcategory.western_brewing),
      }
    if (subcategory.gongfu_brewing)
      data = {
      ...data,
        gongfu_brewing: brewingTimesToSeconds(subcategory.gongfu_brewing),
      }
    return data
  }

  function handleListSelect(event) {
    const item = Object.entries(subcategories).find(
      (entry) => getSubcategoryName(entry[1]) === event.currentTarget.id
    );
    props.setTeaData(defineTeaData(item[1]));
    props.handleBackToLayout();
  }

  useEffect(() => {
    if (value) {
      const item = Object.entries(subcategories).find(
        (entry) => getSubcategoryName(entry[1]) === value
      );
      if (item)
        props.setTeaData(defineTeaData(item[1]));
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
          id="subcategory-autocomplete"
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
      )}
      {!inputValue && (
        <FormGroup>
          <FormLabel className={formListClasses.formLabel}>
            <Typography className={formListClasses.formLabelText}>
              Popular subcategories
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
                  aria-label={option}
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
