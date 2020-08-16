import React, { useContext } from "react";
import Autocomplete, {
  createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import {
  brewingTimesToSeconds,
  getSubcategoryName,
} from "../../../services/ParsingService";
import { subcategoryModel } from '../../../services/Serializers';
import { SubcategoriesState } from "../../statecontainers/SubcategoriesContext";
import { CategoriesState } from '../../statecontainers/CategoriesContext';

const filter = createFilterOptions();

export default function SubAutocomplete({ teaData, setTeaData, renderInput }) {
  /**
   * Mobile tea creation subcategory input component. Shows a list and autocomplete from
   * central subcategories state, with option to add extra.
   * Updates category entry if different than ones in matching subcategory.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const subcategories = useContext(SubcategoriesState);
  const categories = useContext(CategoriesState);

  const options = Object.entries(subcategories)
    .map((entry) => {
      return getSubcategoryName(entry[1]);
    })
    .sort();

  function updateSubcategory(name) {
    if (name) {
      // Look for a match in subcategories central state
      const match = Object.entries(subcategories).find((entry) => {
        const lcName = name.toLowerCase();
        if (getSubcategoryName(entry[1]).toLowerCase() === lcName) return true;
        if (entry[1].name.toLowerCase() === lcName) return true;
        return entry[1].translated_name.toLowerCase() === lcName;
      });
      if (match) {
        const subcategory = match[1];
        const category = Object.entries(categories).find(entry => entry[1].id === subcategory.category)[1];
        // Match found, update also category, origin and brewings
        let data = {
          ...teaData,
          subcategory: subcategory,
          category: subcategory.category,
        };
        if (subcategory.origin)
          data = {
            ...data,
            origin: subcategory.origin,
          };
        if (subcategory.western_brewing)
          data = {
            ...data,
            western_brewing: brewingTimesToSeconds(subcategory.western_brewing),
          };
        else if (category.western_brewing)
          data = {
            ...data,
            western_brewing: category.western_brewing,
          };
        if (subcategory.gongfu_brewing)
          data = {
            ...data,
            gongfu_brewing: brewingTimesToSeconds(subcategory.gongfu_brewing),
          };
        else if (category.gongfu_brewing)
          data = {
            ...data,
            gongfu_brewing: category.gongfu_brewing,
          };
        setTeaData(data);
      } else setTeaData({ ...teaData, subcategory: { name: name } });
    } else setTeaData({ ...teaData, subcategory: subcategoryModel });
  }

  function handleOnChange(event, newValue) {
    if (typeof newValue === "string") {
      updateSubcategory(newValue);
    } else if (newValue && newValue.inputValue) {
      // Create a new value from the user input
      updateSubcategory(newValue.inputValue);
    } else {
      updateSubcategory(newValue);
    }
  }

  return (
    <Autocomplete
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
      id="subcategory"
      fullWidth
      options={options ? options : []}
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
      value={teaData.subcategory && teaData.subcategory.name ? String(teaData.subcategory.name) : ""}
      renderInput={renderInput}
    />
  );
}