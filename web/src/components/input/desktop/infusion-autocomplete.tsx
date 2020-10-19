import React, { ChangeEvent, ReactElement, useContext, useState } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HandleSessionEdit, SessionEditorContext } from "../../edit-session";
import { SessionInstance } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  infusionText: {
    fontSize: 80,
    textAlign: "center",
  },
}));

/**
 * InfusionAutocomplete props.
 *
 * @memberOf InfusionAutocomplete
 */
type Props = {
  /** Session instance state */
  session: SessionInstance;
  /** Removes clock stopping countdown */
  removeClock: () => void;
};

/**
 * Desktop session infusion autocomplete component.
 *
 * @component
 * @subcategory Desktop input
 */
function InfusionAutocomplete({ session, removeClock }: Props): ReactElement {
  const classes = useStyles();

  const max = 40;
  const options = [...Array(max)].map((_, b) => String(b + 1));

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const [infusion, setInfusion] = useState(
    session.current_infusion ? String(session.current_infusion) : "1"
  );

  const [error, setError] = useState("");

  /** Updates infusion state on input change. */
  async function handleOnChange(
    event: ChangeEvent<any>,
    value: string | null
  ): Promise<void> {
    if (event && value) {
      const numbers = value.replace(/[^0-9]/g, "");
      if (options.includes(numbers)) {
        setInfusion(numbers);
        await removeClock();
        await handleSessionEdit(
          { ...session, current_infusion: parseInt(numbers) },
          session.offline_id
        );
        setError("");
      } else setError("Must be between 1 and " + max);
    }
  }

  return (
    <Autocomplete
      id="current_infusion"
      onChange={(event, value) => handleOnChange(event, value)}
      onInputChange={(event, value) => handleOnChange(event, value)}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={options}
      freeSolo
      disableClearable
      value={infusion}
      renderInput={(params) => (
        <TextField
          {...params}
          name="current_infusion"
          label="Infusion"
          aria-label="infusion"
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            classes: {
              input: classes.infusionText,
            },
          }}
          error={!!error}
          helperText={error}
        />
      )}
    />
  );
}

export default InfusionAutocomplete;
