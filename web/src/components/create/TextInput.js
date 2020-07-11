import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  InputBase,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {ArrowBack} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    margin: 0,
    flexDirection: 'column',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  textField: {
    padding: theme.spacing(4),
    flexGrow: 1,
  },
  counter: {
    textAlign: 'right',
  },
}));

export default function TextInput(props) {
  const classes = useStyles();

  const [text, setText] = useState(props.data[props.field])

  const handleChange = (event, value) => setText(event.target.value);

  const handlePrevious = () => props.setEditRoute('INPUT_LIST')

  function handleAdd() {
    props.setData({...props.data, [props.field]: text.replace(/\n/g, " ")});
    handlePrevious();
  }

  const handleFocus = (event) => event.target.select();

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={handlePrevious} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add {props.field}
          </Typography>
          <Button color="inherit" disabled={!text} onClick={handleAdd}>ADD</Button>
        </Toolbar>
      </AppBar>
      <Box className={classes.textField}>
        <InputBase
          onChange={handleChange}
          onFocus={handleFocus}
          id="standard-multiline"
          rows={4}
          rowsMax={Infinity}
          multiline
          autoFocus
          fullWidth
          defaultValue={text}
        />
      </Box>
      <Box className={classes.counter}>
        <Typography>{text.length}</Typography>
      </Box>
    </Box>
  );
};