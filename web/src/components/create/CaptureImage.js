import React, { useRef, useCallback } from "react";
import { Box, IconButton } from "@material-ui/core";
import { CameraAlt, Close, Done, Replay, SkipNext } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
  },
  imageBox: {
    height: "70%",
    overflow: "hidden",
  },
  controlsBox: {
    display: "flex",
    justifyContent: "center",
    margin: "auto",
  },
  control: {
    margin: theme.spacing(4),
  },
}));

const videoConstraints = {
  facingMode: "environment",
};

export default function CaptureImage({
  imageData,
  setImageData,
  handleClose,
  handleNext,
}) {
  /**
   * Mobile tea creation capture stage component.
   *
   * @param imageData {string} Base64 image data
   * @param setImageData {function} Set image data
   * @param handleClose {function} Cancel process and reroute to main route
   * @param handleNext {function} Go to next stage (inputLayout)
   */

  const classes = useStyles();

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const screenshot = webcamRef.current.getScreenshot();
    setImageData(screenshot);
  }, [webcamRef, setImageData]);

  const replay = () => {
    setImageData(null);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.imageBox}>
        {!imageData ? (
          <Webcam
            height={500}
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        ) : (
          <img src={imageData} alt="" />
        )}
      </Box>
      <Box className={classes.controlsBox}>
        <IconButton
          className={classes.control}
          onClick={handleClose}
          color="inherit"
          aria-label="cancel"
        >
          <Close />
        </IconButton>
        {!imageData ? (
          <>
            <IconButton
              className={classes.control}
              onClick={capture}
              color="inherit"
              aria-label="capture"
            >
              <CameraAlt fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.control}
              onClick={handleNext}
              color="inherit"
              aria-label="skip"
            >
              <SkipNext />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              className={classes.control}
              onClick={replay}
              color="inherit"
              aria-label="recapture"
            >
              <Replay fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.control}
              onClick={handleNext}
              color="inherit"
              aria-label="done"
            >
              <Done />
            </IconButton>
          </>
        )}
      </Box>
    </Box>
  );
}
