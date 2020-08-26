import React, {
  ChangeEvent,
  ReactElement,
  ReactNode,
  useContext,
  useState,
} from "react";
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
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
} from "@material-ui/core";
import emptyImage from "../../../media/empty.png";
import SubAutocomplete from "./sub-autocomplete";
import YearAutocomplete from "./year-autocomplete";
import VendorAutocomplete from "./vendor-autocomplete";
import OriginAutocomplete from "./origin-autocomplete";
import {
  brewingTimesToSeconds,
  cropToNoZeroes,
  fahrenheitToCelsius,
} from "../../../services/parsing-services";
import { CategoriesState } from "../../statecontainers/categories-context";
import { validationSchema } from "./validation-schema";
import { useStyles } from "../../../style/DesktopFormStyles";
import {
  BrewingModel,
  OriginModel,
  SubcategoryModel,
  TeaModel,
  TeaRequest,
  VendorModel,
} from "../../../services/models";
import InputFormBrewing from "./input-form-brewing";

interface FormBrewingData extends BrewingModel {
  fahrenheit: boolean;
}

export interface InputFormData extends TeaModel {
  //year: number|string;
  brewing: "gongfu_brewing" | "western_brewing";
  gongfu_brewing: FormBrewingData;
  western_brewing: FormBrewingData;
  measure: "g" | "oz";
  [index: string]: any;
}

/**
 * InputForm props.
 *
 * @memberOf InputForm
 */
type Props = {
  /** Base64 image data from load image stage */
  imageData?: string;
  /** Instance tea data state for initial values on edit mode */
  teaData?: TeaModel;
  /** Handles edit save */
  handleEdit?: (data: TeaModel) => void;
  /** Handle tea posting process */
  handleCreate?: (data: TeaRequest) => void;
  /** Closes dialog */
  handleClose: () => void;
  /** Return to previous stage */
  handlePrevious: () => void;
};

/**
 * Desktop tea creation form. Uses formik with external controlled state teaData.
 *
 * @component
 * @subcategory Desktop input
 */
function InputForm({
  imageData,
  teaData,
  handleEdit,
  handleCreate,
  handleClose,
  handlePrevious,
}: Props): ReactElement {
  const classes = useStyles();

  const categories = useContext(CategoriesState);

  function handleSave(values: FormikValues): void {
    console.log(values);
  }

  return (
    <Box className={classes.root}>
      <img
        className={classes.image}
        src={imageData ? imageData : emptyImage}
        alt=""
      />
      <Formik
        initialValues={
          {
            ...teaData,
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
          } as InputFormData
        }
        validationSchema={validationSchema}
        onSubmit={(values) => handleSave(values)}
      >
        {(formikProps: FormikProps<InputFormData>) => {
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
                  error={!!(errors.name && touched.name)}
                  helperText={errors.name && touched.name && errors.name}
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
                      for (const entry of Object.entries(categories))
                        if (entry[1].id === e.target.value) {
                          setFieldValue("subcategory", {});
                          setFieldValue("gongfu_brewing", {
                            ...entry[1].gongfu_brewing,
                            fahrenheit: false,
                          });
                          setFieldValue("western_brewing", {
                            ...entry[1].western_brewing,
                            fahrenheit: false,
                          });
                        }
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
                <SubAutocomplete {...formikProps} />
                <YearAutocomplete {...formikProps} />
              </Box>
              <Box className={classes.row}>
                <OriginAutocomplete {...formikProps} />
                <VendorAutocomplete {...formikProps} />
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
                  error={!!(errors.weight_left && touched.weight_left)}
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
                  error={!!(errors.price && touched.price)}
                  helperText={errors.price && touched.price && errors.price}
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
              <InputFormBrewing {...formikProps} />
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
