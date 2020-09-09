import { makeStyles, fade } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const formListStyles = makeStyles({
  formLabel: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
    background: fade(theme.palette.primary.light, 0.15),
  },
  formLabelText: {
    flexGrow: 1,
    textTransform: "capitalize",
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    display: "flex",
    minWidth: 0,
    [theme.breakpoints.down("xs")]: {
      width: "100vw",
    },
    textTransform: "capitalize",
  },
  listItemBox: {
    display: "flex",
    flexGrow: 1,
    minWidth: 0,
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  linkSmall: {
    flexGrow: 1,
    textAlign: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "bold",
    color: `${theme.palette.primary.main}`,
    cursor: "pointer",
  },
  textField: {
    padding: theme.spacing(2),
    flexGrow: 1,
  },
  arrowIcon: {
    width: theme.spacing(2),
    height: theme.spacing(2),
  },
});
