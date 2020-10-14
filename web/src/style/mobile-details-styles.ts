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
  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titleIcon: {
    marginBottom: theme.spacing(1),
  },
  lineIcon: {
    marginRight: theme.spacing(0.5),
    color: theme.palette.primary.main,
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
    justifyContent: "space-between",
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  editButton: {
    color: theme.palette.primary.main,
  },
  pageTop: {
    display: "flex",
    flexDirection: "row",
    padding: theme.spacing(2),
  },
  teaImage: {
    minWidth: theme.spacing(14),
    maxWidth: theme.spacing(14),
    minHeight: theme.spacing(18),
    maxHeight: theme.spacing(18),
    objectFit: "cover",
    marginRight: theme.spacing(2),
    borderRadius: theme.spacing(0.75),
    border: `solid 2px ${theme.palette.background.default}`,
  },
  rating: {
    "& .MuiRating-iconFilled": {
      color: theme.palette.secondary.main,
    },
  },
  brewingIcon: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  brewingTitle: {
    flexGrow: 1,
    textAlign: "left",
    margin: "auto",
  },
  brewing: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
  },
  brewingButton: {
    padding: theme.spacing(2),
    width: "100%",
  },
  weightSwitch: {
    marginBottom: theme.spacing(2),
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
    marginBottom: theme.spacing(1),
  },
  countryFlag: {
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
  mapBox: {
    flexGrow: 1,
    marginBottom: -theme.spacing(1),
  },
  brewingBox: {
    marginBottom: 0,
  },
});
