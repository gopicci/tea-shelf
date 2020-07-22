import React, { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";

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

export default function EditOriginOffline(props) {
  const classes = useStyles();

  const [origin, setOrigin] = useState(props.teaData[props.field]);

  const handleChange = (event) =>
    setOrigin({ ...origin, [event.target.id]: event.target.value });

  function handleAdd() {
    props.setTeaData({ ...props.teaData, origin: origin });
    props.handleBackToLayout();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.handleBackToLayout}
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add {props.field}
          </Typography>
          <Button
            color="inherit"
            disabled={!origin || !origin.country}
            onClick={handleAdd}
          >
            ADD
          </Button>
        </Toolbar>
      </AppBar>
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
