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
import {
  InputFormModel,
  TeaInstance,
  TeaRequest,
} from '../../../services/models';
import { CategoriesState } from "../../statecontainers/categories-context";
import { desktopFormStyles} from '../../../style/desktop-form-styles';
import { validationSchema } from "./validation-schema";
import emptyImage from "../../../media/empty.png";
import { fahrenheitToCelsius } from "../../../services/parsing-services";
import {Route} from '../../../app';

/**
 * InputForm props.
 *
 * @memberOf InputForm
 */
type Props = {
  /** Base64 image data from load image stage */
  imageData?: string;
  /** App's main route state, might contain payload for initial values on edit mode */
  route: Route;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
  /** Closes dialog */
  handleClose: () => void;
  /** Routes to previous stage */
  handlePrevious: (payload?: TeaInstance) => void;
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
  route,
  handleEdit,
  handleClose,
  handlePrevious,
}: Props): ReactElement {
  const classes = desktopFormStyles();

  const categories = useContext(CategoriesState);

  const teaData = route.payload;

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

    if (values.year && values.year !== "Unknown")
      data["year"] = parseInt(values.year);

    if (values.subcategory) data["subcategory"] = values.subcategory;
    if (values.origin) data["origin"] = values.origin;
    if (values.vendor) data["vendor"] = values.vendor;
    if (values.price) data["price"] = values.price;

    if (values.weight_left) {
      let grams = parseFloat(values.weight_left);
      if (values.measure === "oz") grams = grams * 28.35;
      if (!isNaN(grams)) data["weight_left"] = grams;
    }

    data["gongfu_brewing"] = {};
    data["western_brewing"] = {};
    if (values.gongfu_brewing.temperature) {
      if (values.gongfu_brewing.fahrenheit)
        data["gongfu_brewing"]["temperature"] = fahrenheitToCelsius(
          parseInt(values.gongfu_brewing.temperature)
        );
      else
        data["gongfu_brewing"]["temperature"] = parseInt(
          values.gongfu_brewing.temperature
        );
    }
    if (values.western_brewing.temperature) {
      if (values.western_brewing.fahrenheit)
        data["western_brewing"]["temperature"] = fahrenheitToCelsius(
          parseInt(values.western_brewing.temperature)
        );
      else
        data["western_brewing"]["temperature"] = parseInt(
          values.western_brewing.temperature
        );
    }
    if (values.gongfu_brewing.weight)
      data["gongfu_brewing"]["weight"] = parseFloat(
        values.gongfu_brewing.weight
      );
    if (values.western_brewing.weight)
      data["western_brewing"]["weight"] = parseFloat(
        values.western_brewing.weight
      );

    if (values.gongfu_brewing.initial)
      data["gongfu_brewing"]["initial"] = values.gongfu_brewing.initial;
    if (values.western_brewing.initial)
      data["western_brewing"]["initial"] = values.western_brewing.initial;
    if (values.gongfu_brewing.increments)
      data["gongfu_brewing"]["increments"] = values.gongfu_brewing.increments;
    if (values.western_brewing.increments)
      data["western_brewing"]["increments"] = values.western_brewing.increments;


    if (values.id) {
      handleEdit(data, values.id);
      handlePrevious({...data, id: values.id});
    } else {
      handleEdit(data);
      handleClose();
    }
  }

  let initialValues: InputFormModel = {
    ...teaData,
    id: teaData?.id ? teaData?.id : "",
    name: teaData?.name ? teaData?.name : "",
    category: teaData?.category ? teaData?.category : 0,
    year: teaData?.year ? teaData?.year : undefined,
    western_brewing: {
      ...teaData?.western_brewing,
      fahrenheit: false,
    },
    gongfu_brewing: {
      ...teaData?.gongfu_brewing,
      fahrenheit: false,
    },
    brewing: "gongfu_brewing",
    measure: "g",
  };

  return (
    <Box className={classes.root}>
      <img
        className={classes.image}
        src={imageData ? imageData : teaData?.image ? teaData.image : emptyImage}
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
                    value={values.brewing}
                    control={<Switch size="small" color="default" />}
                    label={
                      <Typography variant="caption">
                        {values.brewing === "gongfu_brewing"
                          ? "Gongfu"
                          : "Western"}
                      </Typography>
                    }
                    labelPlacement="start"
                    onChange={() => {
                      values.brewing === "gongfu_brewing"
                        ? setFieldValue("brewing", "western_brewing")
                        : setFieldValue("brewing", "gongfu_brewing");
                    }}
                  />
                </FormGroup>
              </Box>
              <InputFormBrewing formikProps={formikProps} />
              <Box className={classes.bottom}>
                <Button onClick={(_) => handlePrevious()} aria-label="back">
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
