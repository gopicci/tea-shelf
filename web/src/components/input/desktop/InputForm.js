import React, { useContext, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
import { fade, makeStyles } from "@material-ui/core/styles";
import emptyImage from "../../../empty.png";
import SubAutocomplete from "./SubAutocomplete";
import YearAutocomplete from "./YearAutocomplete";
import TempAutocomplete from "./TempAutocomplete";
import WeightAutocomplete from "./WeightAutocomplete";
import VendorAutocomplete from "./VendorAutocomplete";
import OriginAutocomplete from "./OriginAutocomplete";
import {
  brewingTimesToSeconds,
  cropToNoZeroes,
  fahrenheitToCelsius,
} from "../../../services/ParsingService";
import { subcategoryModel } from "../../../services/Serializers";
import { CategoriesState } from "../../statecontainers/CategoriesContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  image: {
    height: 200,
    width: "100%",
    objectFit: "cover",
    marginBottom: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(1),
  },
  justifyLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
  },
  justifyRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
  },
  divider: {
    position: "relative",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: fade(theme.palette.background.main, 0.5),
  },
  brewingSwitch: {
    position: "absolute",
    right: theme.spacing(2),
    top: "50%",
    transform: "translateY(-50%)",
  },
  name: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
  category: {
    minWidth: 150,
  },
  subcategory: {
    minWidth: 240,
    paddingRight: theme.spacing(2),
  },
  year: {
    minWidth: 150,
  },
  origin: {
    minWidth: 240,
    paddingRight: theme.spacing(1),
  },
  vendor: {
    minWidth: 240,
    paddingLeft: theme.spacing(1),
  },
  weight: {
    flexGrow: 1,
    minWidth: 240,
    paddingRight: theme.spacing(2),
  },
  weightMeasure: {
    minWidth: 80,
    paddingRight: theme.spacing(2),
  },
  temperature: {
    minWidth: 150,
    maxWidth: 150,
    paddingRight: theme.spacing(2),
  },
  degrees: {
    minWidth: 60,
  },
  brewingWeight: {
    minWidth: 150,
    maxWidth: 150,
  },
  initial: {
    minWidth: 150,
    maxWidth: 150,
    paddingRight: theme.spacing(2),
  },
  initialMeasure: {
    minWidth: 60,
  },
  increments: {
    minWidth: 150,
    maxWidth: 150,
    paddingRight: theme.spacing(2),
  },
  incrementsMeasure: {
    minWidth: 60,
  },
  price: {
    flexGrow: 1,
    minWidth: 240,
  },
  bottom: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(2),
  },
}));

export default function InputForm({
  imageData,
  teaData,
  setTeaData,
  handleEdit = null,
  handleCreate = null,
  handleMobileClose = null,
  handlePrevious,
}) {
  const classes = useStyles();

  const categories = useContext(CategoriesState);

  const [fahrenheit, setFahrenheit] = useState(false);
  const [weightMeasure, setWeightMeasure] = useState("g");
  const [initialMeasure, setInitialMeasure] = useState("s");
  const [incrementsMeasure, setIncrementsMeasure] = useState("s");
  const [brewing, setBrewing] = useState("gongfu_brewing");

  function handleSwitch() {
    if (brewing === "gongfu_brewing") setBrewing("western_brewing");
    else setBrewing("gongfu_brewing");
  }

  const currentYear = new Date().getFullYear();
  const yearOptionsLength = 60;
  const yearOptions = [...Array(yearOptionsLength)].map((_, b) =>
    String(currentYear - b)
  );
  yearOptions.unshift("Unknown");

  const brewingValidation = Yup.object().shape({
    fahrenheit: Yup.boolean(),
    temperature: Yup.number().when("fahrenheit", {
      is: true,
      then: Yup.number()
        .min(32, "Temperature too low")
        .max(210, "Temperature too high")
        .typeError("Must be a number")
        .nullable(),
      otherwise: Yup.number()
        .min(0, "Temperature too low")
        .max(99, "Temperature too high")
        .typeError("Must be a number")
        .nullable(),
    }),
    degrees: Yup.string().oneOf(
      ["fahrenheit", "celsius"],
      "Invalid temperature unit"
    ),
    weight: Yup.number()
      .min(0, "Must be positive")
      .max(100, "Number too high")
      .typeError("Must be a number")
      .nullable(),
    initial: Yup.number()
      .min(0, "Must be positive")
      .max(999, "Number too high")
      .typeError("Must be a number")
      .nullable(),
    initialMeasure: Yup.string().oneOf(["s", "m", "h"], "Invalid time unit"),
    increments: Yup.number()
      .min(0, "Must be positive")
      .max(999, "Number too high")
      .typeError("Must be a number")
      .nullable(),
    incrementsMeasure: Yup.string().oneOf(["s", "m", "h"], "Invalid time unit"),
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(50, "Too long, max length 50 characters")
      .required("Required"),
    category: Yup.number()
      .min(1, "Invalid category")
      .max(9, "Invalid category")
      .required("Required")
      .typeError("Required"),
    subcategory: Yup.object().shape({
      name: Yup.string()
        .max(50, "Too long, max length 50 characters")
        .nullable(),
    }),
    year: Yup.string()
      .oneOf([...yearOptions, null], "Invalid year")
      .nullable(),
    origin: Yup.object().shape({
      country: Yup.string()
        .max(30, "Too long, max length 30 characters")
        .nullable(),
      region: Yup.string()
        .max(50, "Too long, max length 30 characters")
        .nullable(),
      locality: Yup.string()
        .max(50, "Too long, max length 30 characters")
        .nullable(),
      latitude: Yup.number().nullable(),
      longitude: Yup.number().nullable(),
    }),
    vendor: Yup.object().shape({
      name: Yup.string()
        .max(50, "Too long, max length 50 characters")
        .nullable(),
    }),
    weight: Yup.number()
      .min(0, "Weight must be positive")
      .max(100000, "Weight too high")
      .typeError("Weight must be a number")
      .nullable(),
    weightMeasure: Yup.string().oneOf(["g", "oz"], "Invalid measure"),
    price: Yup.number()
      .min(0, "Price must be positive")
      .max(3000, "Price too high")
      .typeError("Price must be a number")
      .nullable(),
    gongfu_brewing: brewingValidation,
    western_brewing: brewingValidation,
  });

  async function handleSave() {
    // convert weight to g into weight_left
    // convert fahrenheit temperature too
    // let grams = parseFloat(e.target.value);
    // if (values.degrees === "oz") grams = grams * 28.35;
    // if (!isNaN(grams))
    //   setTeaData({
    //   ...teaData,
    //   weight_left: cropToNoZeroes(grams, 1),
    // });
    if (handleCreate) {
      let grams = parseFloat(teaData.weight);
      if (weightMeasure === "oz") grams = grams * 28.35;
      if (!isNaN(grams))
        await setTeaData({
          ...teaData,
          weight_left: cropToNoZeroes(grams, 1),
        });

      if (fahrenheit)
        await setTeaData({
          ...teaData,
          gongfu_brewing: {
            ...teaData.gongfu_brewing,
            temperature: fahrenheitToCelsius(
              ...teaData.gongfu_brewing.temperature
            ),
          },
          western_brewing: {
            ...teaData.western_brewing,
            temperature: fahrenheitToCelsius(
              ...teaData.western_brewing.temperature
            ),
          },
        });

      handleCreate();
      handleMobileClose();
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
        initialValues={{
          ...teaData,
          weight: "",
          gongfu_brewing: {
            ...teaData.gongfu_brewing,
            fahrenheit: fahrenheit,
          },
          western_brewing: {
            ...teaData.western_brewing,
            fahrenheit: fahrenheit,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => console.log(values, teaData)}
      >
        {({
          values,
          submitForm,
          isSubmitting,
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
                inputProps={{ maxLength: 50 }}
                size="small"
                variant="outlined"
                value={values.name ? values.name : ""}
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
                  value={values.category ? values.category : ""}
                  onChange={(e) => {
                    handleChange(e);
                    for (const entry of Object.entries(categories))
                      if (entry[1].id === e.target.value)
                        setTeaData({
                          ...teaData,
                          category: entry[1].id,
                          subcategory: subcategoryModel,
                          gongfu_brewing: brewingTimesToSeconds(
                            entry[1].gongfu_brewing
                          ),
                          western_brewing: brewingTimesToSeconds(
                            entry[1].western_brewing
                          ),
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
                name="weight"
                label="Weight"
                inputProps={{ maxLength: 10 }}
                size="small"
                variant="outlined"
                value={values.weight ? values.weight : ""}
                className={classes.weight}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, weight: e.target.value });
                }}
                onBlur={handleBlur}
                error={errors.weight && touched.weight}
                helperText={errors.weight && touched.weight && errors.weight}
              />
              <FormControl
                className={classes.weightMeasure}
                variant="outlined"
                size="small"
              >
                <Select
                  name="weightMeasure"
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
                inputProps={{ maxLength: 10 }}
                size="small"
                variant="outlined"
                value={values.price ? values.price : ""}
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
            <Box className={classes.row}>
              <Box className={classes.justifyLeft}>
                <TempAutocomplete
                  name="temperature"
                  teaData={teaData}
                  setTeaData={setTeaData}
                  fahrenheit={fahrenheit}
                  brewing={brewing}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Temperature"
                      variant="outlined"
                      size="small"
                      className={classes.temperature}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        errors[brewing] &&
                        touched[brewing] &&
                        errors[brewing].temperature &&
                        touched[brewing].temperature
                      }
                      helperText={
                        errors[brewing] &&
                        touched[brewing] &&
                        errors[brewing].temperature &&
                        touched[brewing].temperature &&
                        errors[brewing].temperature
                      }
                    />
                  )}
                />
                <FormControl
                  className={classes.degrees}
                  variant="outlined"
                  size="small"
                >
                  <Select
                    name="degrees"
                    value={fahrenheit ? "fahrenheit" : "celsius"}
                    onChange={(e) =>
                      setFahrenheit(e.target.value === "fahrenheit")
                    }
                    onBlur={handleBlur}
                  >
                    <MenuItem value="celsius">°C</MenuItem>
                    <MenuItem value="fahrenheit">F</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <WeightAutocomplete
                name="brewingWeight"
                teaData={teaData}
                setTeaData={setTeaData}
                brewing={brewing}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Grams per 100ml"
                    variant="outlined"
                    size="small"
                    className={classes.brewingWeight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors[brewing] &&
                      touched[brewing] &&
                      errors[brewing].weight &&
                      touched[brewing].weight
                    }
                    helperText={
                      errors[brewing] &&
                      touched[brewing] &&
                      errors[brewing].weight &&
                      touched[brewing].weight &&
                      errors[brewing].weight
                    }
                  />
                )}
              />
            </Box>
            <Box className={classes.row}>
              <Box className={classes.justifyLeft}>
                <TextField
                  name="initial"
                  label="Initial time"
                  inputProps={{ maxLength: 3 }}
                  size="small"
                  variant="outlined"
                  value={values[brewing].initial ? values[brewing].initial : ""}
                  className={classes.initial}
                  onChange={(e) => {
                    handleChange(e);
                    setTeaData({
                      ...teaData,
                      [brewing]: {
                        ...teaData[brewing],
                        initial: e.target.value,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  error={
                    errors[brewing] &&
                    touched[brewing] &&
                    errors[brewing].initial &&
                    touched[brewing].initial
                  }
                  helperText={
                    errors[brewing] &&
                    touched[brewing] &&
                    errors[brewing].initial &&
                    touched[brewing].initial &&
                    errors[brewing].initial
                  }
                />
                <FormControl
                  className={classes.initialMeasure}
                  variant="outlined"
                  size="small"
                >
                  <Select
                    name="initialMeasure"
                    value={initialMeasure}
                    onChange={(e) => setInitialMeasure(e.target.value)}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="s">s</MenuItem>
                    <MenuItem value="m">m</MenuItem>
                    <MenuItem value="h">h</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box className={classes.justifyRight}>
                <TextField
                  name="increments"
                  label="Increments"
                  inputProps={{ maxLength: 3 }}
                  size="small"
                  variant="outlined"
                  value={
                    values[brewing].increments ? values[brewing].increments : ""
                  }
                  className={classes.increments}
                  onChange={(e) => {
                    handleChange(e);
                    setTeaData({
                      ...teaData,
                      [brewing]: {
                        ...teaData[brewing],
                        increments: e.target.value,
                      },
                    });
                  }}
                  onBlur={handleBlur}
                  error={
                    errors[brewing] &&
                    touched[brewing] &&
                    errors[brewing].increments &&
                    touched[brewing].increments
                  }
                  helperText={
                    errors[brewing] &&
                    touched[brewing] &&
                    errors[brewing].increments &&
                    touched[brewing].increments &&
                    errors[brewing].increments
                  }                />
                <FormControl
                  className={classes.incrementsMeasure}
                  variant="outlined"
                  size="small"
                >
                  <Select
                    name="incrementsMeasure"
                    value={incrementsMeasure}
                    onChange={(e) => setIncrementsMeasure(e.target.value)}
                    onBlur={handleBlur}
                  >
                    <MenuItem value="s">s</MenuItem>
                    <MenuItem value="m">m</MenuItem>
                    <MenuItem value="h">h</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
            <Box className={classes.bottom}>
              <Button onClick={handlePrevious} aria-label="back">
                Back
              </Button>
              <Button onClick={submitForm} aria-label="Create">
                Create
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
