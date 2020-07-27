import React, { useState } from "react";
import { Box, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import InputAppBar from "./InputAppBar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  inputBox: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  textField: {
    marginBottom: theme.spacing(4),
  },
}));

export default function EditOriginOffline({
  teaData,
  field,
  setTeaData,
  handleBackToLayout,
}) {
  /**
   * Mobile tea creation offline origin input component.
   *
   * @param teaData {json} Input tea data state
   * @param setTeaData {function} Set input tea data state
   * @param field {string} Input field name
   * @param handleBackToLayout {function} Reroutes to input layout
   */

  const classes = useStyles();

  const [origin, setOrigin] = useState(teaData[field]);

  const handleChange = (event) =>
    setOrigin({ ...origin, [event.target.id]: event.target.value });

  function handleAdd() {
    setTeaData({ ...teaData, origin: origin });
    handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <InputAppBar
        handleBackToLayout={handleBackToLayout}
        name={field}
        showAdd={true}
        disableAdd={!origin || !origin.country}
        handleAdd={handleAdd}
      />
      <Box className={classes.inputBox}>
        <TextField
          className={classes.textField}
          id="country"
          variant="outlined"
          label="Country *"
          defaultValue={origin && origin.country ? origin.country : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <TextField
          className={classes.textField}
          id="region"
          variant="outlined"
          label="Region"
          defaultValue={origin && origin.region ? origin.region : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <TextField
          className={classes.textField}
          id="locality"
          variant="outlined"
          label="Locality"
          defaultValue={origin && origin.locality ? origin.locality : ""}
          fullWidth
          onChange={handleChange}
          onFocus={handleFocus}
        />
      </Box>
    </Box>
  );
}
