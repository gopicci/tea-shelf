import React, { ReactElement, useContext } from "react";
import { Formik, Form, FormikValues, FormikProps } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  TextField,
  Typography,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";
import SubAutocomplete from "./sub-autocomplete";
import YearAutocomplete from "./year-autocomplete";
import VendorAutocomplete from "./vendor-autocomplete";
import OriginAutocomplete from "./origin-autocomplete";
import InputFormBrewing from "./input-form-brewing";
import { fahrenheitToCelsius } from "../../../services/parsing-services";
import { validationSchema } from "./validation-schema";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeaEditorContext, HandleTeaEdit } from "../../edit-tea";
import { SettingsState } from "../../statecontainers/settings-context";
import { Route } from "../../../app";
import {
  BrewingModel,
  InputFormModel,
  TeaModel,
  TeaRequest,
} from "../../../services/models";
import emptyImage from "../../../media/empty.png";
import { desktopFormStyles } from "../../../style/desktop-form-styles";

/**
 * InputForm props.
 *
 * @memberOf InputForm
 */
type Props = {
  /** Base64 image data from load image stage */
  imageData?: string;
  /** Vision parser state with data extracted from the captured image */
  visionData?: TeaModel;
  /** App's main route state, might contain payload for initial values on edit mode */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** When set to false routes to image load creation stage */
  setImageLoadDone?: (state: boolean) => void;
};

/**
 * Desktop tea editing form component. Uses Formik for form handling and Yup for
 * validation, serializes data before sending it to edit/create handlers.
 *
 * @component
 * @subcategory Desktop input
 */
function InputForm({
  imageData,
  visionData,
  route,
  setRoute,
  setImageLoadDone,
}: Props): ReactElement {
  const classes = desktopFormStyles();

  const settings = useContext(SettingsState);

  const handleTeaEdit: HandleTeaEdit = useContext(TeaEditorContext);
  const categories = useContext(CategoriesState);

  const teaData = route.teaPayload;

  /**
   * Saving process. Serializes data, calls edit
   * or create handlers and reroutes to main.
   *
   * @param {FormikValues} values - Formik form values
   */
  function handleSave(values: FormikValues): void {
    let data: TeaRequest = { name: values.name, category: values.category };

    if (imageData) data["image"] = imageData;
    if (teaData?.image) data["image"] = teaData.image;
    if (teaData?.rating) data["rating"] = teaData.rating;
    if (teaData?.notes) data["notes"] = teaData.notes;

    if (values.year && values.year !== "Unknown")
      data["year"] = parseInt(values.year);
    else data["year"] = null;

    data["subcategory"] = values.subcategory ? values.subcategory : null;
    data["origin"] = values.origin ? values.origin : null;
    data["vendor"] = values.vendor ? values.vendor : null;
    if (values.price) data["price"] = values.price;

    if (values.weight_left) {
      let grams = parseFloat(values.weight_left);
      if (values.measure === "oz") grams = grams * 28.35;
      if (!isNaN(grams)) data["weight_left"] = grams;
    }

    let gongfu: BrewingModel = {};
    let western: BrewingModel = {};
    if (values.gongfu_brewing.temperature) {
      if (values.gongfu_brewing.fahrenheit)
        gongfu["temperature"] = fahrenheitToCelsius(
          parseInt(values.gongfu_brewing.temperature)
        );
      else gongfu["temperature"] = parseInt(values.gongfu_brewing.temperature);
    }
    if (values.western_brewing.temperature) {
      if (values.western_brewing.fahrenheit)
        western["temperature"] = fahrenheitToCelsius(
          parseInt(values.western_brewing.temperature)
        );
      else
        western["temperature"] = parseInt(values.western_brewing.temperature);
    }
    if (values.gongfu_brewing.weight)
      gongfu["weight"] = parseFloat(values.gongfu_brewing.weight);
    if (values.western_brewing.weight)
      western["weight"] = parseFloat(values.western_brewing.weight);

    if (values.gongfu_brewing.initial)
      gongfu["initial"] = values.gongfu_brewing.initial;
    if (values.western_brewing.initial)
      western["initial"] = values.western_brewing.initial;
    if (values.gongfu_brewing.increments)
      gongfu["increments"] = values.gongfu_brewing.increments;
    if (values.western_brewing.increments)
      western["increments"] = values.western_brewing.increments;

    if (Object.keys(gongfu).length) data["gongfu_brewing"] = gongfu;
    if (Object.keys(western).length) data["western_brewing"] = western;

    if (values.id) {
      handleTeaEdit(data, values.id);
      setRoute({ route: "TEA_DETAILS", teaPayload: { ...data, id: values.id } });
    } else {
      handleTeaEdit(data, undefined, "Tea successfully added.");
      setRoute({ route: "MAIN" });
    }
  }

  /** Goes back to previous route. */
  function handlePrevious(): void {
    if (setImageLoadDone) setImageLoadDone(false);
    else setRoute({ route: "TEA_DETAILS", teaPayload: route.teaPayload });
  }

  /**
   * Initial form values. Loads teaData or visionData if any,
   * then initializes required fields.
   */
  let initialValues: InputFormModel = {
    ...visionData,
    ...teaData,
    id: teaData?.id ? teaData?.id : "",
    name: teaData?.name
      ? teaData.name
      : visionData?.name
      ? visionData.name
      : "",
    category: teaData?.category
      ? teaData.category
      : visionData?.category
      ? visionData.category
      : 0,
    year: teaData?.year
      ? teaData.year
      : visionData?.year
      ? visionData.year
      : undefined,
    western_brewing: {
      ...visionData?.western_brewing,
      ...teaData?.western_brewing,
      fahrenheit: false,
    },
    gongfu_brewing: {
      ...visionData?.gongfu_brewing,
      ...teaData?.gongfu_brewing,
      fahrenheit: false,
    },
    brewing_type: settings.gongfu ? "gongfu_brewing" : "western_brewing",
    measure: settings.metric ? "g" : "oz",
  };

  return (
    <Box className={classes.root}>
      <img
        className={classes.image}
        src={
          imageData ? imageData : teaData?.image ? teaData.image : emptyImage
        }
        alt=""
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {(formikProps: FormikProps<InputFormModel>) => {
          const {
            submitForm,
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            touched,
            errors,
          } = formikProps;
          return (
            <Form>
              <Box className={classes.row}>
                <TextField
                  required
                  name="name"
                  label="Name"
                  aria-label="name"
                  inputProps={{ maxLength: 50 }}
                  size="small"
                  variant="outlined"
                  value={values.name ? values.name : ""}
                  className={classes.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(touched.name && errors.name)}
                  helperText={touched.name && errors.name}
                />
                <FormControl
                  className={classes.category}
                  required
                  variant="outlined"
                  size="small"
                  error={!!(touched.category && errors.category)}
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    label="Category"
                    aria-label="category"
                    value={values.category ? values.category : ""}
                    onChange={(e) => {
                      handleChange(e);
                      for (const category of Object.values(categories))
                        if (category.id === e.target.value) {
                          setFieldValue("subcategory", undefined);
                          setFieldValue("gongfu_brewing", {
                            ...category.gongfu_brewing,
                            fahrenheit: false,
                          });
                          setFieldValue("western_brewing", {
                            ...category.western_brewing,
                            fahrenheit: false,
                          });
                        }
                    }}
                    onBlur={handleBlur}
                  >
                    {categories &&
                      Object.values(categories).map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name.charAt(0) +
                            category.name.slice(1).toLowerCase()}
                        </MenuItem>
                      ))}
                  </Select>
                  {errors.category && touched.category && (
                    <FormHelperText>{errors.category}</FormHelperText>
                  )}
                </FormControl>
              </Box>
              <Box className={classes.divider}>
                <Typography variant="caption">Optional</Typography>
              </Box>
              <Box className={classes.row}>
                <SubAutocomplete formikProps={formikProps} />
                <YearAutocomplete formikProps={formikProps} />
              </Box>
              <Box className={classes.row}>
                <OriginAutocomplete formikProps={formikProps} />
                <VendorAutocomplete formikProps={formikProps} />
              </Box>
              <Box className={classes.row}>
                <TextField
                  name="weight_left"
                  label="Weight"
                  aria-label="weight_left"
                  inputProps={{ maxLength: 10 }}
                  size="small"
                  variant="outlined"
                  value={values.weight_left ? values.weight_left : ""}
                  className={classes.weight}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(touched.weight_left && errors.weight_left)}
                  helperText={touched.weight_left && errors.weight_left}
                />
                <FormControl
                  className={classes.weightMeasure}
                  variant="outlined"
                  size="small"
                >
                  <Select
                    name="measure"
                    aria-label="measure"
                    value={values.measure}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="g">g</MenuItem>
                    <MenuItem value="oz">oz</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  name="price"
                  label={"Price per " + values.measure}
                  aria-label="price"
                  inputProps={{ maxLength: 10 }}
                  size="small"
                  variant="outlined"
                  value={values.price ? values.price : ""}
                  className={classes.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Box>
              <Box className={classes.divider}>
                <Typography variant="caption">Brewing instructions</Typography>
                <FormGroup>
                  <FormControlLabel
                    name="brewing"
                    className={classes.brewingSwitch}
                    aria-label="brewing"
                    value={values.brewing_type}
                    control={<Switch size="small" color="default" />}
                    label={
                      <Typography variant="caption">
                        {values.brewing_type === "gongfu_brewing"
                          ? "Gongfu"
                          : "Western"}
                      </Typography>
                    }
                    labelPlacement="start"
                    onChange={() => {
                      values.brewing_type === "gongfu_brewing"
                        ? setFieldValue("brewing", "western_brewing")
                        : setFieldValue("brewing", "gongfu_brewing");
                    }}
                  />
                </FormGroup>
              </Box>
              <InputFormBrewing formikProps={formikProps} />
              <Box className={classes.bottom}>
                <Button onClick={handlePrevious} aria-label="back">
                  Back
                </Button>
                <Button onClick={submitForm} aria-label="save">
                  Save
                </Button>
              </Box>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

export default InputForm;
