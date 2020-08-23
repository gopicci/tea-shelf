import React, { useRef, useCallback, useContext } from "react";
import { Box, IconButton } from "@material-ui/core";
import { CameraAlt, Close, Done, Replay, SkipNext } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import { APIRequest } from "../../../services/AuthService";
import { visionParserSerializer } from "../../../services/Serializers";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SubcategoriesState } from "../../statecontainers/SubcategoriesContext";
import { VendorsState } from "../../statecontainers/VendorsContext";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
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

/**
 * Mobile tea creation capture stage component.
 *
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param imageData {string} Base64 image data
 * @param setImageData {function} Set image data
 * @param handleClose {function} Cancel process and reroute to main route
 * @param handleNext {function} Go to next stage (inputLayout)
 */
export default function CaptureImage({
  teaData,
  setTeaData,
  imageData,
  setImageData,
  handleClose,
  handleNext,
}) {
  const classes = useStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);

  const webcamRef = useRef(null);

  const capture = useCallback(async () => {
    // Get screenshot
    const screenshot = webcamRef.current.getScreenshot();

    // Update image data state
    setImageData(screenshot);

    // Post image to API parser
    const parserRes = await APIRequest(
      "/parser/",
      "POST",
      JSON.stringify({ image: screenshot })
    );

    if (parserRes.ok) {
      // Update teaData with suggestions from parser
      setTeaData({
        ...teaData,
        ...visionParserSerializer(
          await parserRes.json(),
          categories,
          subcategories,
          vendors
        ),
      });
    }
  }, [
    webcamRef,
    setImageData,
    teaData,
    setTeaData,
    categories,
    subcategories,
    vendors,
  ]);

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
