import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
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
import emptyImage from "../../../media/empty.png";
import SubAutocomplete from "./SubAutocomplete";
import YearAutocomplete from "./YearAutocomplete";
import InputFormBrewing from "./InputFormBrewing";
import VendorAutocomplete from "./VendorAutocomplete";
import OriginAutocomplete from "./OriginAutocomplete";
import {
  brewingTimesToSeconds,
  cropToNoZeroes,
  fahrenheitToCelsius,
} from "../../../services/ParsingService";
import { subcategoryModel } from "../../../services/Serializers";
import { CategoriesState } from "../../statecontainers/CategoriesContext";
import { validationSchema } from "./ValidationSchema";
import { useStyles } from "../../../style/DesktopFormStyles";

/**
 * Desktop tea creation form. Uses formik with external controlled state teaData.
 *
 * @param imageData {string} Base64 image data
 * @param teaData {Object} Input tea data state
 * @param setTeaData {function} Set input tea data state
 * @param handleEdit {function} Handle edit save
 * @param handleCreate {function} Handle tea posting process
 * @param handleClose {function}
 * @param handlePrevious {function} Go back to previous stage (LoadImage)
 */
export default function InputForm({
  imageData,
  teaData,
  setTeaData,
  handleEdit = null,
  handleCreate = null,
  handleClose = null,
  handlePrevious,
}) {
  const classes = useStyles();

  const categories = useContext(CategoriesState);

  const [weightMeasure, setWeightMeasure] = useState("g");
  const [brewing, setBrewing] = useState("gongfu_brewing");

  // Defining year selection component options here
  // because they're required by validation schema
  const currentYear = new Date().getFullYear();
  const yearOptionsLength = 60;
  const yearOptions = [...Array(yearOptionsLength)].map((_, b) =>
    String(currentYear - b)
  );
  yearOptions.unshift("Unknown");

  function handleSwitch() {
    if (brewing === "gongfu_brewing") setBrewing("western_brewing");
    else setBrewing("gongfu_brewing");
  }

  function tempToCelsius(data, brewing) {
    if (data[brewing].fahrenheit)
      return {
        ...data,
        [brewing]: {
          ...data[brewing],
          temperature: fahrenheitToCelsius(data[brewing].temperature),
        },
      };
    else return data;
  }

  function handleSave() {
    let data = { ...teaData };

    // Convert weight to grams
    let grams = parseFloat(data.weight_left);
    if (weightMeasure === "oz") grams = grams * 28.35;
    if (!isNaN(grams))
      data = {
        ...data,
        weight_left: cropToNoZeroes(grams, 1),
      };

    // Convert brewing temperature to celsius
    data = tempToCelsius(data, "gongfu_brewing");
    data = tempToCelsius(data, "western_brewing");

    // Convert brewing times from hh:mm:ss format to seconds
    data["gongfu_brewing"] = brewingTimesToSeconds(data["gongfu_brewing"]);
    data["western_brewing"] = brewingTimesToSeconds(data["western_brewing"]);

    if (handleCreate) {
      handleCreate(data);
      handleClose();
    } else {
      handleEdit();
      handlePrevious();
    }
  }

  return (
    <Box className={classes.root}>
      <img
        className={classes.image}
        src={imageData ? imageData : emptyImage}
        alt=""
      />
      <Formik
        enableReinitialize
        initialValues={teaData}
        validationSchema={() => validationSchema(yearOptions)}
        onSubmit={handleSave}
      >
        {({
          submitForm,
          setFieldValue,
          handleChange,
          handleBlur,
          touched,
          errors,
        }) => (
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
                value={teaData.name ? teaData.name : ""}
                className={classes.name}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, name: e.target.value });
                }}
                onBlur={handleBlur}
                error={errors.name && touched.name}
                helperText={errors.name && touched.name && errors.name}
              />
              <FormControl
                className={classes.category}
                required
                variant="outlined"
                size="small"
                error={errors.category && touched.category}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  label="Category"
                  aria-label="category"
                  value={teaData.category ? teaData.category : ""}
                  onChange={(e) => {
                    handleChange(e);
                    for (const entry of Object.entries(categories))
                      if (entry[1].id === e.target.value)
                        setTeaData({
                          ...teaData,
                          category: entry[1].id,
                          subcategory: subcategoryModel,
                          gongfu_brewing: entry[1].gongfu_brewing,
                          western_brewing: entry[1].western_brewing,
                        });
                  }}
                  onBlur={handleBlur}
                >
                  {categories &&
                    Object.entries(categories).map((entry) => (
                      <MenuItem key={entry[1].id} value={entry[1].id}>
                        {entry[1].name.charAt(0) +
                          entry[1].name.slice(1).toLowerCase()}
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
              <SubAutocomplete
                name="subcategory"
                teaData={teaData}
                setTeaData={setTeaData}
                setFieldValue={setFieldValue}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Subcategory"
                    aria-label="subcategory"
                    className={classes.subcategory}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ ...params.inputProps, maxLength: 50 }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.subcategory && touched.subcategory}
                    helperText={
                      errors.subcategory &&
                      touched.subcategory &&
                      errors.subcategory.name
                    }
                  />
                )}
              />
              <YearAutocomplete
                name="year"
                teaData={teaData}
                setTeaData={setTeaData}
                options={yearOptions}
                updateFormValue={handleChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="year"
                    label="Year"
                    aria-label="year"
                    variant="outlined"
                    size="small"
                    className={classes.year}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.year && touched.year}
                    helperText={errors.year && touched.year && errors.year}
                  />
                )}
              />
            </Box>
            <Box className={classes.row}>
              <OriginAutocomplete
                name="origin"
                value={teaData.origin}
                teaData={teaData}
                setTeaData={setTeaData}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Origin"
                    aria-label="origin"
                    variant="outlined"
                    inputProps={{ ...params.inputProps, maxLength: 130 }}
                    size="small"
                    className={classes.origin}
                    fullWidth
                    onBlur={handleBlur}
                    error={errors.origin && touched.origin}
                    helperText={
                      errors.origin && touched.origin && errors.origin.country
                    }
                  />
                )}
              />
              <VendorAutocomplete
                name="vendor"
                teaData={teaData}
                setTeaData={setTeaData}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Vendor"
                    aria-label="vendor"
                    variant="outlined"
                    inputProps={{ ...params.inputProps, maxLength: 50 }}
                    size="small"
                    className={classes.vendor}
                    fullWidth
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.vendor && touched.vendor}
                    helperText={
                      errors.vendor && touched.vendor && errors.vendor.name
                    }
                  />
                )}
              />
            </Box>
            <Box className={classes.row}>
              <TextField
                name="weight_left"
                label="Weight"
                aria-label="weight_left"
                inputProps={{ maxLength: 10 }}
                size="small"
                variant="outlined"
                value={teaData.weight_left ? teaData.weight_left : ""}
                className={classes.weight}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, weight_left: e.target.value });
                }}
                onBlur={handleBlur}
                error={errors.weight_left && touched.weight_left}
                helperText={
                  errors.weight_left &&
                  touched.weight_left &&
                  errors.weight_left
                }
              />
              <FormControl
                className={classes.weightMeasure}
                variant="outlined"
                size="small"
              >
                <Select
                  name="weightMeasure"
                  aria-label="weight_measure"
                  value={weightMeasure}
                  onChange={(e) => setWeightMeasure(e.target.value)}
                  onBlur={handleBlur}
                >
                  <MenuItem value="g">g</MenuItem>
                  <MenuItem value="oz">oz</MenuItem>
                </Select>
              </FormControl>
              <TextField
                name="price"
                label={"Price per " + weightMeasure}
                aria-label="price"
                inputProps={{ maxLength: 10 }}
                size="small"
                variant="outlined"
                value={teaData.price ? teaData.price : ""}
                className={classes.price}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, price: e.target.value });
                }}
                onBlur={handleBlur}
                error={errors.price && touched.price}
                helperText={errors.price && touched.price && errors.price}
              />
            </Box>
            <Box className={classes.divider}>
              <Typography variant="caption">Brewing instructions</Typography>
              <FormGroup>
                <FormControlLabel
                  className={classes.brewingSwitch}
                  aria-label="switch_brewing"
                  value="start"
                  control={<Switch size="small" color="default" />}
                  label={
                    <Typography variant="caption">
                      {brewing === "gongfu_brewing" ? "Gongfu" : "Western"}
                    </Typography>
                  }
                  labelPlacement="start"
                  onChange={handleSwitch}
                />
              </FormGroup>
            </Box>
            <InputFormBrewing
              {...{
                teaData,
                setTeaData,
                brewing,
                classes,
                errors,
                touched,
                handleChange,
                handleBlur,
                setFieldValue,
              }}
            />
            <Box className={classes.bottom}>
              <Button onClick={handlePrevious} aria-label="back">
                Back
              </Button>
              <Button onClick={submitForm} aria-label="save">
                Save
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
