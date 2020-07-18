import {Box, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Add} from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    height: '100vh',
  },

}));


export default function FilterLayoutMobile({setRoute}) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <List>
        <ListItem button key='add'>
          <ListItemIcon><Add /></ListItemIcon>
          <ListItemText primary='Add Tea' />
        </ListItem>
      </List>
    </Box>
  )
}