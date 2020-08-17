import React from "react";
import { Box, Button } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { FileToBase64 } from "../../../services/ImageService";
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
 * Desktop tea creation image loader, converts file to base64
 * and moves to next step.
 *
 * @param setImageData {function} Set base64 image data state
 * @param handleDesktopClose {function} Cancel process and close dialog
 * @param handleNext {function} Go to next creation stage (InputForm)
 */
export default function LoadImage({
  setImageData,
  handleDesktopClose,
  handleNext,
}) {
  const classes = useStyles();

  async function handleChange(files) {
    if (files.length > 0) {
      try {
        await setImageData(await FileToBase64(files[0]));
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
        <Button onClick={handleDesktopClose} aria-label="cancel">
          Cancel
        </Button>
        <Button onClick={handleNext} aria-label="skip">
          Skip
        </Button>
      </Box>
    </Box>
  );
}
