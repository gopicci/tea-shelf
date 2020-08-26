import React, { ReactElement } from "react";
import { Box, Button } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { FileToBase64 } from "../../../services/image-services";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  bottom: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: theme.spacing(2),
  },
}));

/**
 * LoadImage props.
 *
 * @memberOf LoadImage
 */
type Props = {
  /** Sets imageData state, expects a base64 encoded image string */
  setImageData: (image: string) => void;
  /** Closes dialog */
  handleClose: () => void;
  /** Routes to next stage */
  handleNext: () => void;
};

/**
 * Desktop tea creation image loader, converts file to base64
 * and moves to next step.
 *
 * @component
 * @subcategory Desktop input
 */
function LoadImage({
  setImageData,
  handleClose,
  handleNext,
}: Props): ReactElement {
  const classes = useStyles();

  /**
   * Updates create request image state with uploaded file in base64 format.
   *
   * @param {File[]} files - Array of files
   */
  async function handleChange(files: File[]): Promise<void> {
    if (files.length > 0) {
      try {
        setImageData(await FileToBase64(files[0]));
        handleNext();
      } catch (e) {
        console.error(e);
      }
    }
  }

  return (
    <Box className={classes.root}>
      <DropzoneArea
        acceptedFiles={["image/*"]}
        dropzoneText={"Drag and drop an image here or click"}
        onChange={(files) => handleChange(files)}
        filesLimit={1}
        showPreviewsInDropzone={false}
        alertSnackbarProps={{
          anchorOrigin: { vertical: "top", horizontal: "center" },
        }}
      />
      <Box className={classes.bottom}>
        <Button onClick={handleClose} aria-label="cancel">
          Cancel
        </Button>
        <Button onClick={handleNext} aria-label="skip">
          Skip
        </Button>
      </Box>
    </Box>
  );
}

export default LoadImage;
