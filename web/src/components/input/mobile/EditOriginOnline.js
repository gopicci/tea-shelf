import React, { useEffect, useState } from "react";
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
import { v4 as uuidv4 } from "uuid";
import { APIRequest } from "../../../services/AuthService";

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

  const [token, setToken] = useState(null);

  useEffect(() => setToken(uuidv4()), []);

  useEffect(() => {
    let active = true;

    async function getOptions() {
      const res = await APIRequest(
        "/places/autocomplete/",
        "POST",
        JSON.stringify({ input: inputValue, token: token })
      );
      if (res.ok) {
        const results = await res.json();
        if (active) setOptions(results);
      }
    }
    if (inputValue.length > 1) getOptions();
    if (inputValue === "") setOptions([]);

    return () => {
      active = false;
    };
  }, [inputValue, token]);

  async function updateOrigin(newValue) {
    const res = await APIRequest(
      "/places/details/",
      "POST",
      JSON.stringify({ place_id: newValue.place_id, token: token })
    );
    if (res.ok) {
      const body = await res.json();
      const adr = himalaya(body.result.adr_address);
      const origin = {};

      for (const entry of Object.entries(adr))
        if (entry[1].type === "element") {
          if (entry[1].attributes[0].value === "country-name")
            origin["country"] = entry[1].children[0].content;
          else
            origin[entry[1].attributes[0].value] = entry[1].children[0].content;
        }

      origin["latitude"] = body.result.geometry.location.lat;
      origin["longitude"] = body.result.geometry.location.lng;

      setTeaData({ ...teaData, origin: origin });
      handleBackToLayout();
    }
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
