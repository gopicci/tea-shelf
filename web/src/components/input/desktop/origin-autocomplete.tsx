import React, { ReactElement, useEffect, useState } from "react";
import { Grid, TextField, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { LocationOn } from "@material-ui/icons";
import { FormikProps } from "formik";
import parse from "autosuggest-highlight/parse";
import { v4 as uuidv4 } from "uuid";
import { getOriginName } from "../../../services/parsing-services";
import { InputFormModel } from "../../../services/models";
import { desktopFormStyles } from "../../../style/desktop-form-styles";
import {
  getAutocompleteOptions,
  getOriginFromPlace,
} from "../../../services/origin-services";

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

/**
 * OriginAutocomplete props.
 *
 * @memberOf OriginAutocomplete
 */
type Props = {
  /** Formik form render methods and props */
  formikProps: FormikProps<InputFormModel>;
};

/**
 * Desktop tea editing form origin autocomplete component.
 * Requests options from API, works only when online.
 *
 * @component
 * @subcategory Desktop input
 */
function OriginAutocomplete({ formikProps }: Props): ReactElement {
  const { values, handleBlur, errors, touched, setFieldValue } = formikProps;
  const classes = desktopFormStyles();

  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<AutocompletePrediction[]>([]);

  const [token, setToken] = useState("");

  useEffect(() => setToken(uuidv4()), []);

  useEffect(() => {
    let active = true;

    /**
     * Gets autocomplete options from API and updates state.
     */
    async function getOptions(): Promise<void> {
      const results = await getAutocompleteOptions(inputValue, token);
      if (active && results) setOptions(results);
    }

    if (inputValue.length > 1) getOptions();
    if (inputValue === "") setOptions([]);

    return () => {
      active = false;
    };
  }, [inputValue, token]);

  /**
   * Gets selected place details from API, parses them and updates form values.
   *
   * @param {AutocompletePrediction} place - Selected place from autocomplete entries
   */
  async function updateOrigin(place: AutocompletePrediction): Promise<void> {
    setFieldValue("origin", await getOriginFromPlace(place, token));
  }

  return (
    <Autocomplete
      id="origin"
      filterOptions={(x) => x}
      options={options}
      autoComplete
      filterSelectedOptions
      onChange={(event, newValue) => {
        if (newValue && typeof newValue === "object") updateOrigin(newValue);
        else setFieldValue("origin", null);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={() =>
        values.origin?.country ? getOriginName(values.origin) : ""
      }
      clearOnBlur
      freeSolo
      fullWidth
      value={values.origin ? getOriginName(values.origin) : ""}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Origin"
          aria-label="origin"
          variant="outlined"
          inputProps={{ ...params.inputProps, maxLength: 130 }}
          size="small"
          className={classes.origin}
          fullWidth
          onBlur={handleBlur}
          error={!!(touched.origin && errors.origin)}
          helperText={touched.origin && errors.origin}
        />
      )}
      renderOption={(option) => {
        const matches =
          option.structured_formatting.main_text_matched_substrings;
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match) => [match.offset, match.offset + match.length])
        );

        return (
          <Grid container alignItems="center">
            <Grid item>
              <LocationOn className={classes.icon} />
            </Grid>
            <Grid item xs className={classes.listItem}>
              {parts.map((part, index) => (
                <span key={index} className={classes.listItemName}>
                  {part.text}
                </span>
              ))}

              <Typography variant="body2" color="textSecondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Grid>
          </Grid>
        );
      }}
    />
  );
}

export default OriginAutocomplete;
