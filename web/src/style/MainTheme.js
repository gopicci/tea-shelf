import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#5b9166',
      main: '#2e633b',
      dark: '#003814',
    },
  },
  typography:{
    h5: {
      fontSize: 17,
    },
    subtitle1: {
      fontSize: 14,
      color: '#444',
    },
    body2: {
      color: '#888',
    },
  },
});