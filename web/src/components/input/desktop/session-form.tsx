import React, { ReactElement, useContext } from "react";
import { Formik, Form, FormikValues, FormikProps } from "formik";
import { Box, Button, TextField, Typography } from "@material-ui/core";
import { sessionValidationSchema } from "./validation-schema";
import { desktopFormStyles } from "../../../style/desktop-form-styles";
import { SessionEditorContext, HandleSessionEdit } from "../../edit-session";
import { Route } from "../../../app";
import { BrewingModel, SessionModel } from "../../../services/models";

/**
 * SessionForm props.
 *
 * @memberOf SessionForm
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Desktop tea editing form component. Uses Formik for form handling and Yup for
 * validation, serializes data before sending it to edit/create handlers.
 *
 * @component
 * @subcategory Desktop input
 */
function SessionForm({ setRoute }: Props): ReactElement {
  const classes = desktopFormStyles();

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  /**
   * Saving process. Serializes data, calls edit
   * or create handlers and reroutes to main.
   *
   * @param {FormikValues} values - Formik form values
   */
  function handleSave(values: FormikValues): void {
    let data = {} as SessionModel;

    let brewing: BrewingModel = {};

    if (values.brewing.temperature)
      brewing["temperature"] = parseInt(
        values[values.brewing_type].temperature
      );

    if (values.brewing.weight)
      brewing["weight"] = parseFloat(values.brewing.weight);

    brewing["initial"] = values.brewing.initial;
    brewing["increments"] = values.brewing.increments;

    if (Object.keys(brewing).length) data["brewing"] = brewing;

    data["current_infusion"] = values.current_infusion;
    data["is_completed"] = values.is_completed;

    handleSessionEdit(data);
    setRoute({ route: "SESSIONS" });
  }

  /** Goes back to previous route. */
  function handlePrevious(): void {
    setRoute({ route: "SESSIONS" });
  }

  /**
   * Initial form values. Loads teaData or visionData if any,
   * then initializes required fields.
   */
  let initialValues: SessionModel = {
    brewing: {
      initial: "00:00:20",
      increments: "00:00:05",
    },
    created_on: "",
    last_brewed_on: "",
    current_infusion: 1,
    is_completed: false,
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.title}>
        <Typography variant="h4">Create Custom Brewing</Typography>
      </Box>
      <Formik
        initialValues={initialValues}
        validationSchema={sessionValidationSchema}
        onSubmit={handleSave}
      >
        {(formikProps: FormikProps<SessionModel>) => {
          const {
            submitForm,
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
          } = formikProps;
          return (
            <Form>
              <Box className={classes.brewingRow}>
                <Typography variant="h5">Initial time</Typography>
                <TextField
                  name={"brewing.initial"}
                  label="Initial"
                  aria-label={"initial"}
                  inputProps={{ maxLength: 8 }}
                  size="small"
                  variant="outlined"
                  value={
                    values.brewing.initial ? values.brewing.initial : "00:00:00"
                  }
                  className={classes.initial}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!(
                      touched["brewing"]?.initial && errors["brewing"]?.initial
                    )
                  }
                  helperText={
                    touched["brewing"]?.initial && errors["brewing"]?.initial
                  }
                />
              </Box>
              <Box className={classes.brewingRow}>
                <Typography variant="h5">Increments</Typography>
                <TextField
                  name={"brewing.increments"}
                  label="Increments"
                  aria-label={"increments"}
                  inputProps={{ maxLength: 8 }}
                  size="small"
                  variant="outlined"
                  value={
                    values.brewing.increments
                      ? values.brewing.increments
                      : "00:00:00"
                  }
                  className={classes.increments}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    !!(
                      touched["brewing"]?.increments &&
                      errors["brewing"]?.increments
                    )
                  }
                  helperText={
                    touched["brewing"]?.increments &&
                    errors["brewing"]?.increments
                  }
                />
              </Box>
              <Box className={classes.bottom}>
                <Button onClick={handlePrevious} aria-label="back">
                  Cancel
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

export default SessionForm;
