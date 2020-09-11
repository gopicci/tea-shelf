import { createMuiTheme, fade } from "@material-ui/core/styles";
import createBreakpoints from "@material-ui/core/styles/createBreakpoints";

const breakpoints = createBreakpoints({});

const defaultTheme = createMuiTheme();

const main = "#ee1c1c";

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#acacac",
      main: "#717171",
      dark: "#1a1a1a",
    },
    secondary: {
      light: "#bf6565",
      main: main,
      dark: "#580f0f",
    },
    background: {
      default: defaultTheme.palette.background.paper,
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      [breakpoints.down("sm")]: {
        fontSize: 22,
      },
    },
    h2: {
      fontSize: 20,
      color: defaultTheme.palette.text.secondary,
      [breakpoints.down("sm")]: {
        fontSize: 16,
      },
    },
    h3: {
      fontSize: 20,
      [breakpoints.down("sm")]: {
        fontSize: 14,
      },
    },
    h4: {
      fontSize: 16,
      color: defaultTheme.palette.text.disabled,
      [breakpoints.down("sm")]: {
        fontSize: 14,
      },
    },
    h5: {
      fontSize: 16,
      [breakpoints.down("sm")]: {
        fontSize: 15,
      },
    },
    h6: {
      fontSize: 15,
    },
    subtitle1: {
      color: defaultTheme.palette.text.secondary,
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
      color: defaultTheme.palette.text.secondary,
      fontSize: 14,
      [breakpoints.down("sm")]: {
        fontSize: 12,
      },
    },
    caption: {
      color: defaultTheme.palette.text.secondary,
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          backgroundColor: defaultTheme.palette.background.paper,
        },
      },
    },
    MuiAppBar: {
      root: {
        borderBottom: `solid 1px ${defaultTheme.palette.action.disabledBackground}`,
      },
      colorPrimary: {
        color: defaultTheme.palette.action.active,
        backgroundColor: defaultTheme.palette.background.paper,
      },
    },
    MuiListItem: {
      root: {
        "&$selected": {
          color: main,
          backgroundColor: fade(main, 0.16),
          "&:hover": {
            backgroundColor: fade(main, 0.20),
          },
        },
        color: main,
      },
      button: {
        "&:hover": {
          backgroundColor: fade(main, 0.06),
        },
      },
    },
  },
});
