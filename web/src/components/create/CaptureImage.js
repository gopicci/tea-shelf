import React, { useRef, useCallback } from 'react';
import { Box, IconButton } from '@material-ui/core';
import { CameraAlt, Close, Done, Replay, SkipNext } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Webcam from 'react-webcam';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    margin: 0,
    flexDirection: 'column',
    backgroundColor: theme.palette.primary.main,
  },
  imageBox: {
    height: '70%',
    overflow: 'hidden',
  },
  controlsBox: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',

  },
  control: {
    margin: theme.spacing(4),
  },
}));


const videoConstraints = {
  facingMode: "environment",
}

export default function CaptureImage(props) {
  const classes = useStyles();

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    props.setImageData(screenshot);
  }, [webcamRef, props.setImageData]);

  const replay = () => {
    props.setImageData(null);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.imageBox}>
      {
        !props.imageData ?
          <Webcam
            height={500}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          :
          <img src={props.imageData} alt="" />
      }
      </Box>
      <Box className={classes.controlsBox}>
        <IconButton
          className={classes.control}
          onClick={props.handleClose}
          color="inherit"
          aria-label="cancel"
        >
          <Close />
        </IconButton>
        {
          !props.imageData ?
            <>
              <IconButton
                className={classes.control}
                onClick={capture}
                color="inherit"
                aria-label="capture"
              >
                <CameraAlt fontSize='large'/>
              </IconButton>
              <IconButton
                className={classes.control}
                onClick={props.handleNext}
                color="inherit"
                aria-label="skip"
              >
                <SkipNext />
              </IconButton>
            </>
            :
            <>
              <IconButton
                className={classes.control}
                onClick={replay}
                color="inherit"
                aria-label="recapture"
              >
                <Replay fontSize='large'/>
              </IconButton>
              <IconButton
                className={classes.control}
                onClick={props.handleNext}
                color="inherit"
                aria-label="done"
              >
                <Done />
              </IconButton>
            </>
        }
      </Box>
    </Box>
  );
};