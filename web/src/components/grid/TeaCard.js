import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@material-ui/core';

import test from './test.jpg'

const useStyles = makeStyles({
  root: {
    width: 180,
  },
  category: {
    flexGrow: 1,
    textAlign: 'right',
  },
  subcategory: {
    fontStyle: 'italic',
  }
});

export default function TeaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Tea image"
          height="120"
          image={test}
          title="Tea image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Snow Phoenix
          </Typography>
          <Typography className={classes.subcategory} gutterBottom variant="subtitle1" component="h5">
            2015 Jin Jun Mei
          </Typography>
        </CardContent>
        <CardContent>
          <Box className={classes.category}>
            <Typography variant="body2" component="span">
              OOLONG
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
