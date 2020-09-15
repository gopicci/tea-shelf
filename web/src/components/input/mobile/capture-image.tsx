import React, {
  ChangeEvent,
  useRef,
  useContext,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { Box, CircularProgress, Fab, fade } from "@material-ui/core";
import {
  CameraAlt,
  Close,
  Done,
  PermMedia,
  Replay,
  SkipNext,
} from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import Webcam from "react-webcam";
import { APIRequest } from "../../../services/auth-services";
import {
  getImageSize,
  cropDataURL,
  resizeDataURL,
  resizeImage,
} from "../../../services/image-services";
import { visionParserSerializer } from "../../../services/serializers";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { VendorsState } from "../../statecontainers/vendors-context";
import { TeaModel } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    height: "100%",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  imageBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  back: {
    position: "fixed",
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    padding: theme.spacing(4),
    zIndex: 1,
  },
  controlsBox: {
    position: "fixed",
    bottom: 0,
    minHeight: "120px",
    maxHeight: "120px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    padding: theme.spacing(4),
    zIndex: 1,
  },
  webcam: {
    objectFit: "cover",
    minHeight: "100vh",
    maxHeight: "100vh",
    minWidth: "100vw",
    maxWidth: "100vw",
  },
  input: {
    display: "none",
  },
  progressBox: {
    position: "fixed",
    bottom: 0,
    left: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    zIndex: 2,
    backgroundColor: fade(theme.palette.common.black, 0.5),
    padding: "auto",
  },
}));

// Max resolution for the image to be uploaded
const maxResolution = 1080;

const videoConstraints = {
  width: { ideal: maxResolution },
  height: { ideal: maxResolution },
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
 * Once the image is captured or loaded it's cropped/resized and run through
 * API vision parser to extract text data that will be used as default input for
 * the next stage.
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

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const webcamRef = useRef<any>(null);

  /**
   * Captures a screenshot from the webcam stream, crops and resizes it,
   * updates the image data state and runs it through vision parser.
   */
  async function capture(): Promise<void> {
    if (webcamRef.current) {
      const screenshot = webcamRef.current.getScreenshot();

      if (screenshot) {
        setLoading(true);

        try {
          // Crop higher resolution screenshot with visible box ratio
          const size = await getImageSize(screenshot);
          const ratio = window.screen.height / window.screen.width;
          const croppedImage = await cropDataURL(
            screenshot,
            ratio > 1 ? size.height / ratio : size.width,
            ratio > 1 ? size.height : size.width * ratio
          );

          // Resize image based on visible box
          const resizedImage = await resizeDataURL(
            croppedImage,
            window.screen.width,
            window.screen.height
          );

          // Update image data state with resized image
          setImageData(resizedImage);

          // Run through vision parser
          await parseImage(croppedImage);
        } catch (e) {
          console.error(e);
        }

        setLoading(false);
      }
    }
  }

  /**
   * Runs image through vision parser and updates vision
   * data state if response is ok.
   *
   * @param {string} data - Base64 image data
   */
  async function parseImage(data: string): Promise<void> {
    const res = await APIRequest(
      "/parser/",
      "POST",
      JSON.stringify({ image: data })
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

  /**
   * Grabs image data from file input, processes it and runs it
   * through vision parser.
   *
   * @param {ChangeEvent<HTMLInputElement>} event - File input change event
   */
  function handleInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const files = event.target.files;
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      async function () {
        setLoading(true);

        // convert image file to base64 string
        const image = reader.result;

        if (typeof image === "string") {
          try {
            // Resize image to max resolution
            const resizedImage = await resizeImage(image, maxResolution);

            // Update image data state with resized image
            setImageData(resizedImage);

            // Run through vision parser
            await parseImage(resizedImage);
          } catch (e) {
            console.error(e);
          }

          setLoading(false);
        }
      },
      false
    );

    if (files) {
      reader.readAsDataURL(files[0]);
    }
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

  /**
   * Moves to next stage when user sets status to done
   * and loading is finished.
   */
  useEffect(() => {
    if (done && !loading) setImageLoadDone(true);
  }, [done, loading, setImageLoadDone]);

  /**
   * Empties image data
   */
  function replay(): void {
    setImageData("");
  }

  return (
    <Box className={classes.root}>
      {!done && (
        <Box className={classes.back}>
          <Fab
            color="primary"
            size="small"
            onClick={handleClose}
            aria-label="cancel"
          >
            <Close />
          </Fab>
        </Box>
      )}
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
          <img className={classes.webcam} src={imageData} alt="" />
        )}
      </Box>
      {!done && (
        <Box className={classes.controlsBox}>
          <input
            className={classes.input}
            onChange={handleInputChange}
            accept="image/*"
            id="load-image"
            type="file"
          />
          <label htmlFor="load-image">
            <Fab
              color="secondary"
              size="small"
              aria-label="load image"
              component="span"
            >
              <PermMedia />
            </Fab>
          </label>
          {!imageData ? (
            <>
              <Fab color="secondary" onClick={capture} aria-label="capture">
                <CameraAlt fontSize="large" />
              </Fab>
              <Fab
                color="secondary"
                size="small"
                onClick={() => setImageLoadDone(true)}
                aria-label="skip"
              >
                <SkipNext />
              </Fab>
            </>
          ) : (
            <>
              <Fab color="secondary" onClick={replay} aria-label="recapture">
                <Replay fontSize="large" />
              </Fab>
              <Fab
                color="secondary"
                size="small"
                onClick={() => setDone(true)}
                aria-label="done"
              >
                <Done />
              </Fab>
            </>
          )}
        </Box>
      )}
      {done && (
        <Box className={classes.progressBox}>
          <CircularProgress
            color="secondary"
            size={Math.min(
              window.screen.width * 0.5,
              window.screen.height * 0.5
            )}
            thickness={1}
          />
        </Box>
      )}
    </Box>
  );
}

export default CaptureImage;
