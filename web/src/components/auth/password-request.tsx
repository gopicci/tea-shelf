import React, { ReactElement, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  SvgIcon,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Route } from "../../app";
import Logo from "../generics/logo";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://teashelf.app/">
        Tea Shelf
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logo: {
    fontSize: theme.spacing(12),
    marginBottom: theme.spacing(4),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  message: {
    margin: theme.spacing(2),
  },
}));

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
 * Password reset component
 *
 * @component
 * @subcategory Main
 */
function PasswordRequest({ setRoute }: Props): ReactElement {
  const classes = useStyles();

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
      const response = await fetch(`${api_path}/password_reset/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
        }),
      });

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
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <SvgIcon className={classes.logo}>
          <Logo />
        </SvgIcon>

        {!emailSent && (
          <>
            <Typography component="h1" variant="h5">
              Forgot password
            </Typography>
            <Formik
              initialValues={{
                email: "",
              }}
              onSubmit={(values, actions) => onSubmit(values, actions)}
            >
              {({
                errors,
                handleChange,
                handleSubmit,
                isSubmitting,
                values,
                setSubmitting,
                setFieldError,
              }) => (
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <TextField
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
          </>
        )}
        {emailSent && (
          <>
            <Typography variant="h5" className={classes.message}>
              Email sent.
            </Typography>
            <Typography variant="h5" className={classes.message}>
              Click on the email link to reset your password.
            </Typography>
          </>
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default PasswordRequest;
