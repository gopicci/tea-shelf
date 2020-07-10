import React from 'react';
import { Dialog } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import CaptureImage from './CaptureImage';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '50%',
    minWidth: '25%',
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function CreateLayout( { open, handleClose } ) {
  const classes = useStyles();

  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      <CaptureImage handleClose={handleClose} />
    </Dialog>
  );
};