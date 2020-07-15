import React from 'react';
import { Formik } from "formik";
import { Avatar, Box, Button, Container, CssBaseline, Grid, Link, TextField, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const onSubmit = async (values, actions) => {

    fetch(`${process.env.REACT_APP_API}/login/`, {
      method: "post",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ email: values.email, password: values.password }),
    })
      .then(res => res.json()
        .then(data => ({ ok: res.ok, body: data }))
      )
      .then(res => {
        actions.setSubmitting(false);

        if (!res.ok) {
          if (res.body['non_field_errors']) {
            actions.setFieldError("email", "nofield");
            actions.setFieldError("password", res.body['non_field_errors'][0]);
          }
          if (res.body['email']) {
            actions.setFieldError("email", res.body['email'][0]);
          }
          if (res.body['password']) {
            actions.setFieldError("password", res.body['password'][0]);
          }
          throw Error(res.body.statusText);
        } else {
          window.localStorage.setItem('user.auth', JSON.stringify(res.body));
          window.location.reload(false);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
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
          {({ errors,
              handleChange,
              handleSubmit,
              isSubmitting,
              values
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
                helperText={"email" in errors && errors.email !== "nofield" ? errors.email : ""}
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
