import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@material-ui/core';

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

export default function TeaCard({ tea }) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Tea image"
          height="120"
          image={tea.image}
          title="Tea image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {tea.name}
          </Typography>
          <Typography className={classes.subcategory} gutterBottom variant="subtitle1" component="h5">
            {tea.year} {tea.subcategory}
          </Typography>
        </CardContent>
        <CardContent>
          <Box className={classes.category}>
            <Typography variant="body2" component="span">
              {tea.category}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
