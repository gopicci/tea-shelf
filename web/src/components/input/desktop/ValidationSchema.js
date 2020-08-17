import * as Yup from "yup";

/**
 * Desktop tea creation form brewing validation schema.
 */
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
    .max(86399, "Number too high")
    .typeError("Must be a number")
    .nullable(),
  increments: Yup.number()
    .min(0, "Must be positive")
    .max(86399, "Number too high")
    .typeError("Must be a number")
    .nullable(),
});

/**
 * Desktop tea creation form validation schema.
 *
 * @param yearOptions {[String]} Valid year selections
 */
export function validationSchema(yearOptions) {
  return Yup.object().shape({
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
    weight_left: Yup.number()
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
}
