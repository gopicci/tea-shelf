import React, { ReactElement, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import { Button, Grid, Link, TextField, Typography } from "@material-ui/core";
import AuthLayout, { authStyles } from "./auth-layout";
import { Route } from "../../app";
import { APIRequest } from "../../services/auth-services";

/**
 * Password request input values type.
 *
 * @memberOf PasswordRequest
 */
type Inputs = {
  /** Email input */
  email: string;
};

/**
 * PasswordRequest props.
 *
 * @memberOf PasswordRequest
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * New password request component
 *
 * @component
 * @subcategory Auth
 */
function PasswordRequest({ setRoute }: Props): ReactElement {
  const classes = authStyles();

  const [emailSent, setEmailSent] = useState(false);

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
      const response = await APIRequest(
        `${api_path}/password_reset/`,
        "POST",
        JSON.stringify({
          email: values.email,
        })
      );

      const data = await response.json();

      actions.setSubmitting(false);

      if (!response.ok) {
        if (data["non_field_errors"]) {
          actions.setFieldError("email", "nofield");
        }
        if (data["email"]) {
          actions.setFieldError("email", data["email"][0]);
        }
        console.error(response.statusText);
      } else {
        setEmailSent(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <AuthLayout title={emailSent ? "Email sent" : "Forgot password"}>
      {!emailSent ? (
        <Formik
          initialValues={{
            email: "",
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
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={"email" in errors}
                helperText={
                  "email" in errors && errors.email !== "nofield"
                    ? errors.email
                    : ""
                }
                onChange={handleChange}
                value={values.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                className={classes.submit}
              >
                Send Email
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => setRoute({ route: "REGISTER" })}
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      ) : (
        <Typography variant="h5" className={classes.message}>
          Click on the email link to reset your password.
        </Typography>
      )}
    </AuthLayout>
  );
}

export default PasswordRequest;
