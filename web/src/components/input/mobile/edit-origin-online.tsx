import React, { ReactElement, useEffect, useState } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ArrowBack, LocationOn } from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import { v4 as uuidv4 } from "uuid";
import { TeaRequest } from "../../../services/models";
import {
  getAutocompleteOptions,
  getOriginFromPlace,
} from "../../../services/origin-services";
import {getOriginName} from '../../../services/parsing-services';

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    flexGrow: 1,
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

type AutocompletePrediction = google.maps.places.AutocompletePrediction;

/**
 * EditOriginOnline props.
 *
 * @memberOf EditOriginOnline
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
 * Mobile tea creation online origin input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditOriginOnline({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const classes = useStyles();

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
   * Gets selected place details, updates input state and routes back to input layout.
   *
   * @param {AutocompletePrediction} place - Selected place from autocomplete entries
   */
  async function updateOrigin(place?: AutocompletePrediction): Promise<void> {
    if (place) {
      const origin = await getOriginFromPlace(place, token);
      if (origin) setTeaData({...teaData, origin: origin});
    } else setTeaData({...teaData, origin: undefined});
    handleBackToLayout();
  }

  return (
    <>
      <Autocomplete
        id="origin-autocomplete"
        filterOptions={(x) => x}
        options={options}
        autoComplete
        filterSelectedOptions
        onChange={(event, newValue) => {
          if (newValue && typeof newValue === "object") updateOrigin(newValue);
          else updateOrigin(undefined);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        getOptionLabel={() =>
          teaData.origin?.country ? getOriginName(teaData.origin) : ""
        }
        clearOnBlur
        freeSolo
        fullWidth
        value={teaData.origin ? getOriginName(teaData.origin) : ""}
        ListboxProps={{ style: { maxHeight: "60vh" } }}
        PaperComponent={({ children }) => <Box>{children}</Box>}
        renderInput={(params) => (
          <TextField
            {...params}
            className={classes.textField}
            variant="outlined"
            placeholder="Search origin"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton
                    onClick={handleBackToLayout}
                    edge="start"
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
        renderOption={(option: AutocompletePrediction) => {
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
                  <span
                    key={index}
                    style={{ fontWeight: part.highlight ? 700 : 400 }}
                  >
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
    </>
  );
}

export default EditOriginOnline;
