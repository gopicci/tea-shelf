import React, { ReactChild, ReactElement } from "react";
import {
  Box,
  Container,
  CssBaseline,
  Link,
  SvgIcon,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

export const authStyles = makeStyles((theme) => ({
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
  center: {
    textAlign: "center",
  },
}));

/**
 * AuthLayout props
 *
 * @memberOf AuthLayout
 */
type Props = {
  /** Children components */
  children: ReactChild;
  /** Auth page title */
  title: string;
};

/**
 * Base layout for auth routes
 *
 * @component
 * @subcategory Auth
 */
function AuthLayout({ children, title }: Props): ReactElement {
  const classes = authStyles();

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <SvgIcon className={classes.logo}>
          <Logo />
        </SvgIcon>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        {children}
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default AuthLayout;
