import React, { useRef, useCallback, useState } from 'react';
import { Box, IconButton } from '@material-ui/core';
import { CameraAlt, Close, Done, Replay, SkipNext } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Webcam from 'react-webcam';


const useStyles = makeStyles((theme) => ({
  imageArea: {
    width: 500,
    height: 500,
    overflow: 'hidden',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
}));

export default function CaptureImage( { handleClose } ) {
  const classes = useStyles();

  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  const replay = () => {
    setImgSrc(null);
  };

  return (
    <>
      <Box className={classes.imageArea}>
      {
        !imgSrc ?
          <Webcam
            height={500}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
          />
          :
          <img src={imgSrc} />
      }
      </Box>
      <Box className={classes.controls}>
        <IconButton
          onClick={handleClose}
          color="inherit"
          aria-label="cancel"
        >
          <Close />
        </IconButton>
        {
          !imgSrc ?
            <>
              <IconButton
                onClick={capture}
                color="inherit"
                aria-label="capture"
              >
                <CameraAlt fontSize='large'/>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="skip"
              >
                <SkipNext />
              </IconButton>
            </>
            :
            <>
              <IconButton
                onClick={replay}
                color="inherit"
                aria-label="capture"
              >
                <Replay fontSize='large'/>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="capture"
              >
                <Done />
              </IconButton>
            </>
        }

      </Box>
    </>
  );
};