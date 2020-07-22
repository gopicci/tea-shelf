import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ArrowBack, LocationOn } from "@material-ui/icons";
import parse from "autosuggest-highlight/parse";
import { parse as himalaya } from "himalaya";
import throttle from "lodash/throttle";
import { fade, makeStyles } from "@material-ui/core/styles";

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
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
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

export default function EditOrigin(props) {
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
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue, types: ["(regions)"] }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

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

  useEffect(() => {
    if (!placesService.current && window.google) {
      placesService.current = new window.google.maps.places.PlacesService(
        window.document.createElement("div")
      );
    }
    if (!placesService.current || !value) {
      return undefined;
    }

    placesService.current.getDetails(
      {
        placeId: value.place_id,
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

          props.setTeaData({ ...props.teaData, origin: origin });
          props.handleBackToLayout();
        }
      }
    );
  }, [value]);

  return (
    <Box className={classes.root}>
      <Autocomplete
        id="google-map-demo"
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
      <Button>Create new origin</Button>
    </Box>
  );
}
