import React, { ReactElement } from "react";
import {
  Button,
  CssBaseline,
  Container,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  SvgIcon,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Route } from "../app";
import { Formik, FormikHelpers } from "formik";

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
}));

/**
 * Register input values type.
 *
 * @memberOf Register
 */
type Inputs = {
  /** Email input */
  email: string;
  /** Password input */
  password1: string;
  /** Confirm password input */
  password2: string;
};

/**
 * Register props.
 *
 * @memberOf Register
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * App register component
 *
 * @component
 * @subcategory Main
 */
function Register({ setRoute }: Props): ReactElement {
  const classes = useStyles();

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
      const response = await fetch(`${api_path}/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password1: values.password1,
          password2: values.password2,
        }),
      });

      const data = await response.json();

      actions.setSubmitting(false);

      if (!response.ok) {
        if (data["non_field_errors"]) {
          actions.setFieldError("password1", data["non_field_errors"][0]);
          actions.setFieldError("password2", data["non_field_errors"][0]);
        }
        if (data["email"]) {
          actions.setFieldError("email", data["email"][0]);
        }
        if (data["password1"]) {
          actions.setFieldError("password1", data["password1"][0]);
        }
        if (data["password2"]) {
          actions.setFieldError("password2", data["password2"][0]);
        }
        console.error(response.statusText);
      } else {
        const loginResponse = await fetch(`${api_path}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            password1: values.password,
          }),
        });
        const loginData = await loginResponse.json();
        if (loginResponse.ok)
          window.localStorage.setItem("user.auth", JSON.stringify(loginData));
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <SvgIcon
          className={classes.logo}
          shapeRendering="geometricPrecision"
          viewBox="0 0 512 512"
        >
          <defs>
            <mask id="a" maskUnits="userSpaceOnUse">
              <circle cx="256" cy="256" r="256" fill="#ececec" />
            </mask>
          </defs>
          <circle r="256" cy="256" cx="256" fill="#f2f2f2" />
          <circle
            r="229.7"
            cy="256"
            cx="256"
            fill="none"
            stroke="red"
            stroke-width="9"
          />
          <circle
            r="165.5"
            cy="256"
            cx="256"
            fill="none"
            stroke="gray"
            stroke-width="70.1"
            stroke-dasharray="140 70"
            stroke-dashoffset="182.3"
          />
          <circle
            cx="256"
            cy="256"
            r="75.2"
            fill="none"
            stroke="red"
            stroke-width="18"
          />
          <circle r="50.8" cy="256" cx="256" fill="green" />
          <path
            mask="url(#a)"
            d="M256-170l1 422-71 388c-2 10 684-20 684-30S690-220 660-240s-404 70-404 70z"
            fill-opacity=".1"
          />
        </SvgIcon>
        <Typography component="h1" variant="h5">
          Sign un
        </Typography>
        <Formik
          initialValues={{
            email: "",
            password1: "",
            password2: "",
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
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="password1"
                label="Password"
                type="password"
                id="password1"
                autoComplete="current-password"
                error={"password1" in errors}
                helperText={"password1" in errors ? errors.password1 : ""}
                onChange={handleChange}
                value={values.password1}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password2"
                label="Confirm password"
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
                Sign Up
              </Button>
              <Grid container justify={"flex-end"}>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => setRoute({ route: "REGISTER" })}
                  >
                    Already have an account? Sign In
                  </Link>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Register;
