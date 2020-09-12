import React, { ReactElement } from "react";
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
}));

/**
 * Login input values type.
 *
 * @memberOf Login
 */
type Inputs = {
  /** Email input */
  email: string;
  /** Password input */
  password: string;
};

/**
 * Login props.
 *
 * @memberOf Login
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * App login component
 *
 * @component
 * @subcategory Main
 */
function Login({ setRoute }: Props): ReactElement {
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
      const response = await fetch(`${api_path}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      actions.setSubmitting(false);

      if (!response.ok) {
        if (data["non_field_errors"]) {
          actions.setFieldError("email", "nofield");
          actions.setFieldError("password", data["non_field_errors"][0]);
        }
        if (data["email"]) {
          actions.setFieldError("email", data["email"][0]);
        }
        if (data["password"]) {
          actions.setFieldError("password", data["password"][0]);
        }
        console.error(response.statusText);
      } else {
        window.localStorage.setItem("user.auth", JSON.stringify(data));
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
        <SvgIcon className={classes.logo}>
          <Logo />
        </SvgIcon>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{
            email: "",
            password: "",
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
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={"password" in errors}
                helperText={"password" in errors ? errors.password : ""}
                onChange={handleChange}
                value={values.password}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => setRoute({ route: "PASSWORD_REQUEST" })}
                  >
                    Forgot password?
                  </Link>
                </Grid>
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
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default Login;
