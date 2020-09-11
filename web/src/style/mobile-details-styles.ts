import { makeStyles } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const mobileDetailsStyles = makeStyles({
  card: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    margin: theme.spacing(0.5),
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
  titleBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  titleIcon: {
    marginBottom: theme.spacing(1),
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
  source: {
    marginTop: theme.spacing(1),
  },
  notesBox: {
    display: "flex",
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "center",
    paddingBottom: theme.spacing(2),
  },
  notes: {
    textAlign: "left",
  },
  name: {
    margin: theme.spacing(1),
  },
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
  mapBox: {
    flexGrow: 1,
    marginBottom: -theme.spacing(1),
  },
});
