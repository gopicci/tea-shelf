import React from "react";
import { Formik } from "formik";
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
import { APIRequest } from "../services/AuthService";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
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
    fontSize: theme.spacing(8),
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
 * Default login component
 */
export default function Login() {
  const classes = useStyles();

  const onSubmit = async (values, actions) => {
    try {
      const response = await APIRequest(
        "/login/",
        "POST",
        JSON.stringify({ email: values.email, password: values.password })
      );

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
        window.location.reload(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <SvgIcon
          className={classes.logo}
          shapeRendering="geometricPrecision"
          viewBox="0 0 270.9 270.9"
        >
          <path
            fill="#916f6f"
            stroke="#916f6f"
            stroke-width=".4"
            d="M11 29h248v21H11zM11 220h248v21H11z"
          />
          <path
            d="M73 60c-10 29 0 87 20 112 22 28 52 26 66 21s27-44 7-75c-19-30-60-52-93-58z"
            fill="#338000"
            stroke="green"
            stroke-width=".5"
          />
          <path
            d="M149 185c8 6 16 14 25 19s26 6 26 6l-2-10s-17-2-25-8l-27-21z"
            fill="#338000"
          />
          <g>
            <path
              fill="#916f6f"
              stroke="#916f6f"
              stroke-width=".4"
              d="M217 259V11h21v248z"
            />
          </g>
          <g>
            <path
              fill="#916f6f"
              stroke="#916f6f"
              stroke-width=".4"
              d="M33 259V11h21v248z"
            />
          </g>
        </SvgIcon>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={onSubmit}
        >
          {({ errors, handleChange, handleSubmit, isSubmitting, values }) => (
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
                color="primary"
                disabled={isSubmitting}
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
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
