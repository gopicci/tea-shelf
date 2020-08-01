import { createMuiTheme } from "@material-ui/core/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const breakpoints = createBreakpoints({})

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#577889",
      main: "#2e5263",
      dark: "#002838",
    },
    background: {
      main: "#dadfe5",
    },
  },
  typography: {
    h1: {
      [breakpoints.down("sm")]: {
        fontSize: 24,
      },
    },
    h2: {
      [breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    h5: {
      fontSize: 17,
      [breakpoints.down("sm")]: {
        fontSize: 15,
      },
    },
    subtitle1: {
      color: "#444",
      fontSize: 14,
      [breakpoints.down("sm")]: {
        fontSize: 13,
      },
    },
    body1: {
      [breakpoints.down("sm")]: {
        fontSize: 13,
      },
    },
    body2: {
      color: "#666",
      fontSize: 14,
      [breakpoints.down("sm")]: {
        fontSize: 12,
      },
    },
    caption: {
      color: "#666",
    },
  },
});
