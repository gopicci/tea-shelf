import React, { ReactElement, useContext } from "react";
import { Box, Button } from "@material-ui/core";
import { DropzoneArea } from "material-ui-dropzone";
import { resizeImage } from "../../../services/image-services";
import { APIRequest } from "../../../services/auth-services";
import { visionParserSerializer } from "../../../services/serializers";
import { makeStyles } from "@material-ui/core/styles";
import { CategoriesState } from "../../statecontainers/categories-context";
import { SubcategoriesState } from "../../statecontainers/subcategories-context";
import { VendorsState } from "../../statecontainers/vendors-context";
import { TeaModel } from "../../../services/models";

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

// Max resolution for the image to be uploaded
const maxResolution = 1080;

/**
 * LoadImage props.
 *
 * @memberOf LoadImage
 */
type Props = {
  /** Sets imageData state, expects a base64 encoded image string */
  setImageData: (image: string) => void;
  /** Sets vision state with data returning from vision parser */
  setVisionData: (data: TeaModel) => void;
  /** Closes dialog */
  handleClose: () => void;
  /** When set to true routes to input creation stage */
  setImageLoadDone: (state: boolean) => void;
};

/**
 * Desktop tea creation image loader. Converts File input to base64,
 * resizes and runs through API vision parser to extract text data
 * that will be used as default input for the next stage.
 *
 * @component
 * @subcategory Desktop input
 */
function LoadImage({
  setImageData,
  setVisionData,
  handleClose,
  setImageLoadDone,
}: Props): ReactElement {
  const classes = useStyles();

  const categories = useContext(CategoriesState);
  const subcategories = useContext(SubcategoriesState);
  const vendors = useContext(VendorsState);

  /**
   * Updates create request image state with uploaded file in base64 format,
   * and tries to run the image through API vision parser.
   *
   * @param {File[]} files - Array of files
   */
  async function handleChange(files: File[]): Promise<void> {
    const reader = new FileReader();

    reader.addEventListener(
      "load",
      async function () {
        // convert image file to base64 string
        const image = reader.result;

        if (typeof image === "string") {
          try {
            const resizedImage = await resizeImage(image, maxResolution);

            // Update image data state with resized image
            setImageData(resizedImage);

            // Post image to API parser
            const res = await APIRequest(
              "/parser/",
              "POST",
              JSON.stringify({ image: resizedImage })
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
          } catch (e) {
            console.error(e);
          }
        }
        setImageLoadDone(true);
      },
      false
    );
    if (files.length) {
      reader.readAsDataURL(files[0]);
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
        showAlerts={["error", "info"]}
        alertSnackbarProps={{
          anchorOrigin: { vertical: "top", horizontal: "center" },
        }}
      />
      <Box className={classes.bottom}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => setImageLoadDone(true)}>Skip</Button>
      </Box>
    </Box>
  );
}

export default LoadImage;
