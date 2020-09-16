import React, { useState, useContext, ReactElement } from "react";
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
import { formListStyles } from "../../../style/form-list-styles";
import { VendorsState } from "../../statecontainers/vendors-context";
import { TeaRequest } from "../../../services/models";
import { FilterOptionsState } from "@material-ui/lab";
import {FilterState} from '../../statecontainers/filter-context';

type Option = { inputValue: string; label: string } | string;

const filter = createFilterOptions<Option>();

/**
 * EditVendor props.
 *
 * @memberOf EditVendor
 */
type Props = {
  /** Tea input data state  */
  teaData: TeaRequest;
  /** Sets tea data state */
  setTeaData: (data: TeaRequest) => void;
  /** Reroutes to input layout */
  handleBackToLayout: () => void;
};

/**
 * Mobile tea creation vendor input component. Shows a list and autocomplete from
 * global vendors state, with option to add extra.
 *
 * @component
 * @subcategory Mobile input
 */
function EditVendor({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const formListClasses = formListStyles();

  const vendors = useContext(VendorsState);
  const filters = useContext(FilterState);

  const userVendors = Object.keys(filters.filters.vendors);

  const [inputValue, setInputValue] = useState("");

  const options = Object.values(vendors).map((vendor) => {
    return vendor.name;
  });

  function updateVendor(name: string): void {
    // If input already exist add the object, otherwise add only the name
    const vendor = Object.values(vendors).find((value) => value.name === name);
    if (vendor) setTeaData({ ...teaData, vendor: vendor });
    else setTeaData({ ...teaData, vendor: { name: name } });
    handleBackToLayout();
  }

  /**
   * Parses input value before calling vendor
   * update method.
   *
   * @param {Option} value - Input value
   */
  function handleOnChange(value: Option): void {
    if (typeof value === "string") {
      updateVendor(value);
    } else if (value && value.inputValue) {
      // Create a new value from the user input
      updateVendor(value.inputValue);
    }
  }

  return (
    <>
      {options && (
        <Autocomplete
          onChange={(_, value) => value && handleOnChange(value)}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          filterOptions={(
            options: Option[],
            params: FilterOptionsState<Option>
          ) => {
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
          getOptionLabel={(option: Option): string => {
            if (typeof option === "string") return option;
            if (option.inputValue) return option.inputValue;
            return String(option);
          }}
          renderOption={(option: Option) => {
            if (typeof option === "string") return option;
            if (option.label) return option.label;
            return String(option);
          }}
          freeSolo
          ListboxProps={{ style: { maxHeight: "60vh" } }}
          PaperComponent={({ children }) => <Box>{children}</Box>}
          renderInput={(params) => (
            <TextField
              {...params}
              className={formListClasses.textField}
              variant="outlined"
              placeholder="Search vendor"
              fullWidth
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={handleBackToLayout}
                      edge="start"
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
      {!inputValue && userVendors.length > 0 && (
        <FormGroup>
          <FormLabel className={formListClasses.formLabel}>
            <Typography className={formListClasses.formLabelText}>
              Popular vendors
            </Typography>
          </FormLabel>
          <List className={formListClasses.list}>
            {userVendors.map((vendor) => (
                <ListItem
                  button
                  className={formListClasses.listItem}
                  key={vendor}
                  id={vendor}
                  onClick={(e) => updateVendor(e.currentTarget.id)}
                >
                  <Box className={formListClasses.listItemBox}>
                    <Typography variant={"body2"}>{vendor}</Typography>
                  </Box>
                </ListItem>
              ))}
          </List>
        </FormGroup>
      )}
    </>
  );
}

export default EditVendor;
