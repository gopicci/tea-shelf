import { createMuiTheme } from "@material-ui/core/styles";

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
    h5: {
      fontSize: 17,
    },
    subtitle1: {
      fontSize: 14,
      color: "#444",
    },
    body2: {
      color: "#888",
    },
  },
});
