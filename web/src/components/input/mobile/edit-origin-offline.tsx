import React, { ChangeEvent, FocusEvent, ReactElement, useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./input-app-bar";
import { TeaRequest } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  inputBox: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
}));

/**
 * EditOriginOffline props.
 *
 * @memberOf EditOriginOffline
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
 * Mobile tea creation offline origin input component.
 *
 * @component
 * @subcategory Mobile input
 */
function EditOriginOffline({
  teaData,
  setTeaData,
  handleBackToLayout,
}: Props): ReactElement {
  const classes = useStyles();

  // Overwriting global interface to make all fields optional for local editing
  type LocalOrigin = {
    country?: string;
    region?: string;
    locality?: string;
  };

  const [origin, setOrigin] = useState<LocalOrigin | undefined>(teaData.origin);

  /**
   * Updates local state.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - Item select event
   */
  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.value) {
      if (event.target.id === "country")
        setOrigin({ ...origin, country: event.target.value });
      if (event.target.id === "region")
        setOrigin({ ...origin, region: event.target.value });
      if (event.target.id === "locality")
        setOrigin({ ...origin, locality: event.target.value });
    }
  }

  /**
   * Updates tea input state and routes back to input layout.
   */
  function handleSave(): void {
    if (origin?.country)
      setTeaData({
        ...teaData,
        origin: {
          country: origin.country,
          region: origin.region,
          locality: origin.locality,
        },
      });
    handleBackToLayout();
  }

  /**
   * Select text on focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event - Focus event
   */
  function handleFocus(event: FocusEvent<HTMLInputElement>): void {
    event.target.select();
  }

  return (
    <>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name="origin"
        saveName="Save"
        disableSave={!origin?.country}
        handleSave={handleSave}
      />
      <Box className={classes.inputBox}>
        <TextField
          className={classes.textField}
          id="country"
          variant="outlined"
          label="Country *"
          defaultValue={origin?.country ? origin.country : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <TextField
          className={classes.textField}
          id="region"
          variant="outlined"
          label="Region"
          defaultValue={origin?.region ? origin.region : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <TextField
          className={classes.textField}
          id="locality"
          variant="outlined"
          label="Locality"
          defaultValue={origin?.locality ? origin.locality : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </Box>
    </>
  );
}

export default EditOriginOffline;
