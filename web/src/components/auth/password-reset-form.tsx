import React, { ReactElement } from "react";
import { Formik, FormikHelpers } from "formik";
import { Button, Link, TextField, Typography } from "@material-ui/core";
import { APIRequest } from "../../services/auth-services";
import { authStyles } from "./auth-layout";
import { Route } from "../../app";

/**
 * Password reset input values type.
 *
 * @memberOf PasswordResetForm
 */
type Inputs = {
  /** New password input */
  password1: string;
  /** Confirm new password input */
  password2: string;
};

/**
 * PasswordResetForm props.
 *
 * @memberOf PasswordResetForm
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Password reset token for unauthorized requests */
  token?: string;
  /** User email for authorized requests */
  email?: string;
  /** Password reset state */
  reset: boolean;
  /** Set password reset state */
  setReset: (reset: boolean) => void;
  /** Reset request API endpoint */
  endpoint: string;
};

/**
 * Password reset component
 *
 * @component
 * @subcategory Auth
 */
function PasswordResetForm({
  setRoute,
  token,
  email,
  reset,
  setReset,
  endpoint,
}: Props): ReactElement {
  const classes = authStyles();

  /**
   * Handles submitting. Posts values to API
   * and updates form with errors. If response
   * is ok saves tokens to cache and reload.
   *
   * @param {Inputs} values - Input values
   * @param {FormikHelpers<Inputs>} actions - Formik callbacks
   */
  async function onSubmit(
    values: Inputs,
    actions: FormikHelpers<Inputs>
  ): Promise<void> {
    let api_path = process.env.REACT_APP_API;
    if (api_path === undefined) api_path = "/api";

    try {
      if (values.password1 !== values.password2) {
        actions.setFieldError("password1", "");
        actions.setFieldError("password2", "Passwords mush match");
        return;
      }

      let response;

      if (token)
        response = await fetch(`${api_path}${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: values.password1,
            token: token,
          }),
        });
      else if (email)
        response = await APIRequest(
          endpoint,
          "PUT",
          JSON.stringify({
            email: email,
            password1: values.password1,
            password2: values.password2,
          })
        );
      else return;

      const data = await response.json();

      actions.setSubmitting(false);

      if (!response.ok) {
        if (data["non_field_errors"]) {
          actions.setFieldError("password1", "nofield");
          actions.setFieldError("password2", data["non_field_errors"][0]);
        }
        if (data["password"]) {
          actions.setFieldError("password1", data["password"][0]);
          actions.setFieldError("password2", data["password"][1]);
        }
        if (data["password1"]) {
          actions.setFieldError("password1", data["password1"][0]);
        }
        if (data["password2"]) {
          actions.setFieldError("password2", data["password2"][0]);
        }
        console.error(response.statusText);
      } else {
        setReset(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return !reset ? (
    <Formik
      initialValues={{
        password1: "",
        password2: "",
      }}
      onSubmit={(values, actions) => onSubmit(values, actions)}
    >
      {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password1"
            label="New password"
            type="password"
            id="password1"
            autoComplete="current-password"
            error={"password1" in errors}
            helperText={"password1" in errors ? errors.password1 : ""}
            onChange={handleChange}
            value={values.password1}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm new password"
            type="password"
            id="password2"
            autoComplete="current-password"
            error={"password2" in errors}
            helperText={"password2" in errors ? errors.password2 : ""}
            onChange={handleChange}
            value={values.password2}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="secondary"
            disabled={isSubmitting}
            className={classes.submit}
          >
            Update password
          </Button>
        </form>
      )}
    </Formik>
  ) : token ? (
    <Link
      href="https://teashelf.app/"
      onClick={() => setRoute({ route: "MAIN" })}
      className={classes.message}
      variant="h5"
    >
      Click here to log in.
    </Link>
  ) : (
    <Typography className={classes.message}>
      Password changed successfully.
    </Typography>
  );
}

export default PasswordResetForm;
