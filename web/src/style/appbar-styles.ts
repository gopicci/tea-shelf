import { fade, makeStyles } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const appBarStyles = makeStyles({
  input: {
    backgroundColor: theme.palette.action.hover,
    "&:hover": {
      backgroundColor: fade("#000", 0.025),
    },
  },
});
