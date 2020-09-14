import React, {
  useRef,
  useCallback,
  useContext,
  ReactElement,
  useEffect,
} from "react";
import { Box, IconButton } from "@material-ui/core";
import { CameraAlt, Close, Done, Replay, SkipNext } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import { APIRequest } from "../../../services/auth-services";
import {
  getImageHeight,
  cropDataURL,
  resizeDataURL,
} from "../../../services/image-services";
import { visionParserSerializer } from "../../../services/serializers";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { VendorsState } from "../../statecontainers/vendors-context";
import { TeaModel } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.secondary.main,
    width: "100%",
    height: window.innerHeight,
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  imageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  webcam: {
    minHeight: "80vh",
    maxHeight: "80vh",
  },
}));

const videoConstraints = {
  width: { ideal: 1080 },
  height: { ideal: 1080 },
  facingMode: "environment",
};

/**
 * CaptureImage props.
 *
 * @memberOf CaptureImage
 */
type Props = {
  /** Capture image state as a base64 encoded string */
  imageData: string;
  /** Sets imageData state, expects a base64 encoded image string */
  setImageData: (image: string) => void;
  /** Sets vision state with data returning from vision parser */
  setVisionData: (data: TeaModel) => void;
  /** Closes editor and return to main route */
  handleClose: () => void;
  /** When set to true routes to input creation stage */
  setImageLoadDone: (state: boolean) => void;
};

/**
 * Mobile image capture component, used as first stage of tea creation process.
 * Once the image is capture it's run through vision parser API to extract data
 * that will be used as default input state of next stage.
 *
 * @component
 * @subcategory Mobile input
 */
function CaptureImage({
  imageData,
  setImageData,
  setVisionData,
  handleClose,
  setImageLoadDone,
}: Props): ReactElement {
  const classes = useStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);

  const webcamRef = useRef<any>(null);

  const capture = useCallback(async () => {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();

      if (screenshot) {
        // Crop higher resolution screenshot with box ratio
        const cropHeight = await getImageHeight(screenshot);
        const ratio = (window.screen.height * 0.8) / window.screen.width;
        const cropWidth = cropHeight / ratio;
        const croppedImage = await cropDataURL(
          screenshot,
          cropWidth,
          cropHeight
        );

        // Resize image based on visible box
        const resizedImage = await resizeDataURL(
          croppedImage,
          window.screen.width,
          window.screen.height * 0.8
        );

        // Update image data state with resized image
        setImageData(resizedImage);

        // Post cropped image to API parser
        const res = await APIRequest(
          "/parser/",
          "POST",
          JSON.stringify({ image: croppedImage })
        );

        if (res.ok) {
          // Update visionData state with suggestions from parser
          setVisionData({
            ...visionParserSerializer(
              await res.json(),
              categories,
              subcategories,
              vendors
            ),
          });
        }
      }
    }
  }, [
    webcamRef,
    setImageData,
    setVisionData,
    categories,
    subcategories,
    vendors,
  ]);

  /** Empties image data */
  function replay(): void {
    setImageData("");
  }

  useEffect(() => {
    /**
     * Applies custom behavior on browser history pop event.
     *
     * @param {PopStateEvent} event - Popstate event
     * @memberOf CaptureImage
     */
    function onBackButtonEvent(event: PopStateEvent): void {
      event.preventDefault();
      handleClose();
    }

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, [handleClose]);

  return (
    <Box className={classes.root}>
      <Box className={classes.imageBox}>
        {!imageData ? (
          <Webcam
            className={classes.webcam}
            audio={false}
            imageSmoothing={false}
            forceScreenshotSourceSize={true}
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
          aria-label="cancel"
        >
          <Close />
        </IconButton>
        {!imageData ? (
          <>
            <IconButton
              className={classes.control}
              onClick={capture}
              aria-label="capture"
            >
              <CameraAlt fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.control}
              onClick={() => setImageLoadDone(true)}
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
              aria-label="recapture"
            >
              <Replay fontSize="large" />
            </IconButton>
            <IconButton
              className={classes.control}
              onClick={() => setImageLoadDone(true)}
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

export default CaptureImage;
