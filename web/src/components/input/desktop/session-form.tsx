import React, { ReactElement, useContext } from "react";
import { Formik, Form, FormikValues, FormikProps } from "formik";
import {
  Box,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
} from "@material-ui/core";

import InputFormBrewing from "./input-form-brewing";
import { fahrenheitToCelsius } from "../../../services/parsing-services";
import { desktopFormStyles } from "../../../style/desktop-form-styles";
import { SessionEditorContext, HandleSessionEdit } from "../../edit-session";
import { SettingsState } from "../../statecontainers/settings-context";
import { Route } from "../../../app";
import {
  BrewingModel,
  SessionFormModel,
  SessionModel,
} from "../../../services/models";
import TeaAutocomplete from "./tea-autocomplete";
import validator from "validator";

/**
 * SessionForm props.
 *
 * @memberOf SessionForm
 */
type Props = {
  /** App's main route state, might contain payload for initial values on edit mode */
  route: Route;
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
function SessionForm({ route, setRoute }: Props): ReactElement {
  const classes = desktopFormStyles();

  const settings = useContext(SettingsState);

  const handleSessionEdit: HandleSessionEdit = useContext(SessionEditorContext);

  const sessionData = route.sessionPayload;

  /**
   * Saving process. Serializes data, calls edit
   * or create handlers and reroutes to main.
   *
   * @param {FormikValues} values - Formik form values
   */
  function handleSave(values: FormikValues): void {
    let data = {} as SessionModel;

    if (values.tea) {
      if (typeof values.tea === "string") data["name"] = values.tea;
      else if (
        typeof values.tea.id === "string" &&
        validator.isUUID(values.tea.id)
      )
        data["tea"] = values.tea.id;
    }

    let brewing: BrewingModel = {};

    if (values[values.brewing_type].temperature) {
      if (values[values.brewing_type].fahrenheit)
        brewing["temperature"] = fahrenheitToCelsius(
          parseInt(values[values.brewing_type].temperature)
        );
      else
        brewing["temperature"] = parseInt(
          values[values.brewing_type].temperature
        );
    }
    if (values[values.brewing_type].weight)
      brewing["weight"] = parseFloat(values[values.brewing_type].weight);
    if (values[values.brewing_type].initial)
      brewing["initial"] = values[values.brewing_type].initial;
    if (values[values.brewing_type].increments)
      brewing["increments"] = values[values.brewing_type].increments;

    if (Object.keys(brewing).length) data["brewing"] = brewing;

    handleSessionEdit(data, undefined, "Brewing session successfully created.");
    setRoute({ route: "MAIN" });
  }

  /** Goes back to previous route. */
  function handlePrevious(): void {
    setRoute({ route: "MAIN" });
  }

  /**
   * Initial form values. Loads teaData or visionData if any,
   * then initializes required fields.
   */
  let initialValues: SessionFormModel = {
    brewing: sessionData?.brewing ? sessionData.brewing : {},
    created_on: sessionData?.created_on ? sessionData.created_on : "",
    current_infusion: sessionData?.current_infusion
      ? sessionData.current_infusion
      : 1,
    is_completed: sessionData?.is_completed ? sessionData.is_completed : false,
    western_brewing: {
      fahrenheit: false,
    },
    gongfu_brewing: {
      fahrenheit: false,
    },
    brewing_type: settings.gongfu ? "gongfu_brewing" : "western_brewing",
  };

  return (
    <Box className={classes.root}>
      <Formik initialValues={initialValues} onSubmit={handleSave}>
        {(formikProps: FormikProps<SessionFormModel>) => {
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
              <Box className={classes.divider}>
                <Typography variant="caption">Select a tea</Typography>
              </Box>
              <Box className={classes.row}>
                <TeaAutocomplete formikProps={formikProps} />
              </Box>
              <Box className={classes.divider}>
                <Typography variant="caption">
                  Or enter custom brewing instructions
                </Typography>
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

export default SessionForm;
