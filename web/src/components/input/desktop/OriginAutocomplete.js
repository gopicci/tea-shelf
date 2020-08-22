import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { LocationOn } from "@material-ui/icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import parse from "autosuggest-highlight/parse";
import { parse as himalaya } from "himalaya";
import { v4 as uuidv4 } from "uuid";
import { APIRequest } from "../../../services/AuthService";
import { getOriginName } from "../../../services/ParsingService";
import { originModel } from "../../../services/Serializers";

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  listItem: {
    paddingBottom: theme.spacing(1),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  listItemName: {
    fontWeight: 400,
  },
}));

/**
 * Desktop tea creation form origin autocomplete component.
 * Requests options from API, works only when online.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param renderInput {component} Input component
 */
export default function OriginAutocomplete({
  teaData,
  setTeaData,
  renderInput,
}) {
  const classes = useStyles();

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
        console.log("autocomplete", results);
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
    if (newValue && typeof newValue === "object") {
      const res = await APIRequest(
        "/places/details/",
        "POST",
        JSON.stringify({ place_id: newValue.place_id, token: token })
      );
      if (res.ok) {
        const body = await res.json();
        console.log("details", body.result);
        const adr = himalaya(body.result.adr_address);
        const origin = {};

        for (const entry of Object.entries(adr))
          if (entry[1].type === "element") {
            if (entry[1].attributes[0].value === "country-name")
              origin["country"] = entry[1].children[0].content;
            else
              origin[entry[1].attributes[0].value] =
                entry[1].children[0].content;
          }

        if (origin["extended-address"])
          origin["locality"] = origin["extended-address"].split(",")[0];

        if (origin["region"])
          origin["region"] = origin["region"].replace(" Province", "");

        origin["latitude"] = body.result.geometry.location.lat;
        origin["longitude"] = body.result.geometry.location.lng;
        console.log("origin", origin);
        setTeaData({ ...teaData, origin: origin });
      }
    } else setTeaData({ ...teaData, origin: originModel });
  }

  return (
    <Autocomplete
      id="origin"
      filterOptions={(x) => x}
      options={options}
      autoComplete
      filterSelectedOptions
      onChange={(event, newValue) => {
        updateOrigin(newValue);
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      getOptionLabel={() =>
        teaData.origin.country ? getOriginName(teaData.origin) : ""
      }
      clearOnBlur
      freeSolo
      fullWidth
      value={teaData.origin}
      renderInput={renderInput}
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
