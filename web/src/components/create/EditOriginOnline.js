import React, { useEffect, useState, useRef, useMemo } from "react";
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
import { parse as himalaya } from "himalaya";
import throttle from "lodash/throttle";

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };
const placesService = { current: null };

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

export default function EditOriginOnline({
  teaData,
  setTeaData,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation online origin input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();

  const [value, setValue] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GCLOUD_API_KEY}&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions([]);
      return undefined;
    }

    fetch({ input: inputValue, types: ["(regions)"] }, (results) => {
      if (active) {
        let newOptions = [];

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [inputValue, fetch]);

  function updateOrigin(newValue) {
    if (!placesService.current && window.google) {
      placesService.current = new window.google.maps.places.PlacesService(
        window.document.createElement("div")
      );
    }
    if (!placesService.current || !newValue) {
      return undefined;
    }

    placesService.current.getDetails(
      {
        placeId: newValue.place_id,
        fields: ["adr_address"],
      },
      function (place, status) {
        if (status === "OK") {
          const json = himalaya(place.adr_address);
          const origin = {};

          for (const entry of Object.entries(json))
            if (entry[1].type === "element") {
              if (entry[1].attributes[0].value === "country-name")
                origin["country"] = entry[1].children[0].content;
              else
                origin[entry[1].attributes[0].value] =
                  entry[1].children[0].content;
            }

          setTeaData({ ...teaData, origin: origin });
          handleBackToLayout();
        }
      }
    );
  }

  return (
    <>
      <Autocomplete
        id="origin-autocomplete"
        className={classes.autocomplete}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.description
        }
        filterOptions={(x) => x}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        value={value}
        onChange={(event, newValue) => {
          setOptions(newValue ? [newValue, ...options] : options);
          setValue(newValue);
          updateOrigin(newValue);
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
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
