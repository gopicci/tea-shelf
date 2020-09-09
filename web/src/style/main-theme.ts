import { createMuiTheme, fade } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({});

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#577889",
      main: "#2e5263",
      dark: "#002838",
    },
    background: {
      default: "#fff",
      paper: "#fff",
    }
  },
  typography: {
    h1: {
      fontSize: 32,
      [breakpoints.down("sm")]: {
        fontSize: 24,
      },
    },
    h2: {
      fontSize: 20,
      color: "#666",
      [breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    h3: {
      fontSize: 20,
      [breakpoints.down("sm")]: {
        fontSize: 18,
      },
    },
    h4: {
      fontSize: 16,
      color: "#666",
      [breakpoints.down("sm")]: {
        fontSize: 14,
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
  overrides: {
    MuiAppBar: {
      root: {
        borderBottom: `solid 1px ${fade("#000", 0.12)}`
      },
      colorPrimary: {
        color: fade("#000", 0.54),
        backgroundColor: "#fff",
      }
    }
  }
});
