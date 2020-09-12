import React, { ReactElement, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Container,
  CssBaseline,
  Link,
  SvgIcon,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Logo from "../generics/logo";
import { Route } from "../../app";

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
 * Password reset input values type.
 *
 * @memberOf PasswordReset
 */
type Inputs = {
  /** New password input */
  password1: string;
  /** Confirm new password input */
  password2: string;
};

/**
 * PasswordReset props.
 *
 * @memberOf PasswordReset
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Password reset token */
  token: string;
};

/**
 * Password reset component
 *
 * @component
 * @subcategory Main
 */
function PasswordReset({ setRoute, token }: Props): ReactElement {
  const classes = useStyles();

  const [reset, setReset] = useState(false);

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

      const response = await fetch(`${api_path}/password_reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: values.password1,
          token: token,
        }),
      });

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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <SvgIcon className={classes.logo}>
          <Logo />
        </SvgIcon>
        {!reset && (
          <>
            <Typography component="h1" variant="h5">
              Update password
            </Typography>
            <Formik
              initialValues={{
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
                <form
                  className={classes.form}
                  noValidate
                  onSubmit={handleSubmit}
                >
                  <TextField
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
                    Update
                  </Button>
                </form>
              )}
            </Formik>
          </>
        )}
        {reset && (
          <>
            <Typography variant="h5" className={classes.message}>
              Password updated.
            </Typography>
            <Link
              href="https://teashelf.app/"
              variant="body2"
              onClick={() => setRoute({ route: "MAIN" })}
              className={classes.message}
            >
              Click here to log in.
            </Link>
          </>
        )}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default PasswordReset;
