import { makeStyles } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const mobileDetailsStyles = makeStyles({
  card: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    borderRadius: 0,
    marginBottom: theme.spacing(2),
  },
  genericBox: {
    flexGrow: 1,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    margin: theme.spacing(2),
  },
  divider: {
    width: `calc(100% - ${theme.spacing(4)}px)`,
    height: theme.spacing(1),
    marginTop: theme.spacing(1),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  center: {
    margin: "auto",
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  grow: {
    flexGrow: 1,
  },
  centerGrow: {
    flexGrow: 1,
    textAlign: "center",
  },
});
