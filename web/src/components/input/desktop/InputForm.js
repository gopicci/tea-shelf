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
    right: theme.spacing(1),
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
  measure: {
    minWidth: 150,
    paddingRight: theme.spacing(2),
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
    margin: theme.spacing(2),
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

  const [imperial, setImperial] = useState(false);

  const [gongfu, setGongfu] = useState(true);

  function handleSwitch() {
    setGongfu(!gongfu);
  }

  const currentYear = new Date().getFullYear();
  const yearOptionsLength = 60;
  const yearOptions = [...Array(yearOptionsLength)].map((_, b) =>
    String(currentYear - b)
  );
  yearOptions.unshift("Unknown");

  function initializeData(obj) {
    return JSON.parse(JSON.stringify(obj, (k, v) => (v === null ? "" : v)));
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .max(50, "Too long, max length 50 characters")
      .required("Required"),
    category: Yup.number()
      .min(1, "Invalid category")
      .max(9, "Invalid category")
      .required("Required"),
    subcategory: Yup.object().shape({
      name: Yup.string().max(50, "Too long, max length 50 characters"),
    }),
    year: Yup.mixed().oneOf(yearOptions, "Invalid year"),
    origin: Yup.object().shape({
      country: Yup.string().max(30, "Too long, max length 30 characters"),
    }),
    vendor: Yup.object().shape({
      name: Yup.string().max(50, "Too long, max length 50 characters"),
    }),
    weight: Yup.number()
      .min(0, "Weight must be positive")
      .max(100000, "Weight too big"),
    price: Yup.number()
      .min(0, "Price must be positive")
      .max(3000, "Price too high"),
    gongfu_brewing: Yup.object().shape({
      imperial: Yup.boolean(),
      temperature: Yup.number().when("imperial", {
        is: true,
        then: Yup.number()
          .min(32, "Temperature too low")
          .max(210, "Temperature too high"),
        otherwise: Yup.number()
          .min(0, "Temperature too low")
          .max(99, "Temperature too high"),
      }),
    }),
    western_brewing: Yup.object().shape({
      imperial: Yup.boolean(),
      temperature: Yup.number().when("imperial", {
        is: true,
        then: Yup.number()
          .min(32, "Temperature too low")
          .max(210, "Temperature too high"),
        otherwise: Yup.number()
          .min(0, "Temperature too low")
          .max(99, "Temperature too high"),
      }),
    }),
  });

  function handleSave() {
    // convert weight to g into weight_left
    // convert imperial temperature too
    // let grams = parseFloat(e.target.value);
    // if (values.measure === "oz") grams = grams * 28.35;
    // if (!isNaN(grams))
    //   setTeaData({
    //   ...teaData,
    //   weight_left: cropToNoZeroes(grams, 1),
    // });
    if (handleCreate) {
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
        initialValues={initializeData({
          ...teaData,
          weight: null,
          gongfu_brewing: {
            ...teaData.gongfu_brewing,
            imperial: imperial,
          },
          western_brewing: {
            ...teaData.western_brewing,
            imperial: imperial,
          },
        })}
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
                value={values.name}
                className={classes.name}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, name: e.target.value });
                }}
                onBlur={handleBlur}
                helperText={errors.name && touched.name && errors.name}
              />
              <FormControl
                className={classes.category}
                required
                variant="outlined"
                size="small"
              >
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  label="Category"
                  value={values.category}
                  onChange={(e) => {
                    handleChange(e);
                    setTeaData({ ...teaData, category: e.target.value });
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Year"
                    variant="outlined"
                    size="small"
                    className={classes.year}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                value={values.weight}
                className={classes.weight}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, weight: e.target.value });
                }}
                onBlur={handleBlur}
                helperText={errors.weight && touched.weight && errors.weight}
              />
              <TextField
                name="price"
                label={"Price per " + (imperial ? "oz" : "g")}
                inputProps={{ maxLength: 10 }}
                size="small"
                variant="outlined"
                value={values.price}
                className={classes.price}
                onChange={(e) => {
                  handleChange(e);
                  setTeaData({ ...teaData, price: e.target.value });
                }}
                onBlur={handleBlur}
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
                      {gongfu ? "Gongfu" : "Western"}
                    </Typography>
                  }
                  labelPlacement="start"
                  onChange={handleSwitch}
                />
              </FormGroup>
            </Box>
            <Box className={classes.row}>
              <TempAutocomplete
                name="temperature"
                teaData={teaData}
                setTeaData={setTeaData}
                imperial={imperial}
                gongfu={gongfu}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={imperial ? "F" : "°C"}
                    variant="outlined"
                    size="small"
                    className={classes.temperature}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      gongfu
                        ? errors.gongfu_brewing &&
                          touched.gongfu_brewing &&
                          errors.gongfu_brewing.temperature &&
                          touched.gongfu_brewing.temperature &&
                          errors.gongfu_brewing.temperature
                        : errors.western_brewing &&
                          touched.western_brewing &&
                          errors.western_brewing.temperature &&
                          touched.western_brewing.temperature &&
                          errors.western_brewing.temperature
                    }
                  />
                )}
              />
              <WeightAutocomplete
                name="brewingWeight"
                teaData={teaData}
                setTeaData={setTeaData}
                gongfu={gongfu}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="g/100ml"
                    variant="outlined"
                    size="small"
                    className={classes.brewingWeight}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    helperText={
                      gongfu
                        ? errors.gongfu_brewing &&
                          touched.gongfu_brewing &&
                          errors.gongfu_brewing.weight &&
                          touched.gongfu_brewing.weight &&
                          errors.gongfu_brewing.weight
                        : errors.western_brewing &&
                          touched.western_brewing &&
                          errors.western_brewing.weight &&
                          touched.western_brewing.weight &&
                          errors.western_brewing.weight
                    }
                  />
                )}
              />
            </Box>
            <Box className={classes.bottom}>
              <Button onClick={handlePrevious} aria-label="back">
                Back
              </Button>
              <FormControl
                className={classes.measure}
                variant="outlined"
                size="small"
              >
                <Select
                  name="measure"
                  value={imperial ? "imperial" : "metric"}
                  onChange={(e) => setImperial(e.target.value === "imperial")}
                  onBlur={handleBlur}
                >
                  <MenuItem value="metric">Metric</MenuItem>
                  <MenuItem value="imperial">Imperial</MenuItem>
                </Select>
              </FormControl>
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
