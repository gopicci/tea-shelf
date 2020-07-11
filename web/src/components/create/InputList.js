import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {formListStyles} from '../../style/FormListStyles'

import InputItem from './InputItem';
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
}));

export default function InputList(props) {
  const classes = useStyles();
  const formListClasses = formListStyles();

  function handleClick(event) {
    switch (event.currentTarget.id) {
      case "name":
      case "subcategory":
        props.setEditRoute({route: 'TEXT_INPUT', field: event.currentTarget.id})
        break
      default:
        return event
    }
  }

  return (
    <Box className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={props.handlePrevious} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Add Tea
          </Typography>
          <Button color="inherit" disabled>ADD</Button>
        </Toolbar>
      </AppBar>
      <FormGroup>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.entryName}>
            Required
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
            <InputItem key='name' name='name' value={props.data.name} handleClick={handleClick} />
            <InputItem key='category' name='category' value={props.data.category} handleClick={handleClick} />
        </List>
        <FormLabel className={formListClasses.formLabel}>
          <Typography className={formListClasses.entryName}>
            Optional
          </Typography>
        </FormLabel>
        <List className={formListClasses.list}>
          {
            Object.entries(props.data).map(([key, value]) => (
              !(['name', 'category'].includes(key)) &&
              <InputItem key={key} name={key} value={value} handleClick={handleClick} />
            ))
          }
        </List>
      </FormGroup>
    </Box>
  );
};