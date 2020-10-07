import { fade, makeStyles } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const desktopFormStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  image: {
    height: 200,
    width: "100%",
    objectFit: "cover",
    marginBottom: theme.spacing(2),
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(1),
  },
  brewingRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: theme.spacing(4),
    marginRight: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  justifyLeft: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "left",
  },
  justifyRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
  },
  divider: {
    position: "relative",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(0.5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.divider,
  },
  brewingSwitch: {
    position: "absolute",
    right: theme.spacing(2),
    top: "50%",
    transform: "translateY(-50%)",
  },
  name: {
    flexGrow: 1,
    paddingRight: theme.spacing(2),
  },
  category: {
    minWidth: 150,
  },
  subcategory: {
    minWidth: 240,
    paddingRight: theme.spacing(2),
  },
  year: {
    minWidth: 150,
  },
  origin: {
    minWidth: 240,
    paddingRight: theme.spacing(1),
  },
  vendor: {
    minWidth: 240,
    paddingLeft: theme.spacing(1),
  },
  weight: {
    flexGrow: 1,
    minWidth: 240,
    paddingRight: theme.spacing(2),
  },
  weightMeasure: {
    minWidth: 80,
    paddingRight: theme.spacing(2),
  },
  temperature: {
    minWidth: 150,
    maxWidth: 150,
    marginRight: theme.spacing(2),
  },
  degrees: {
    minWidth: 60,
  },
  brewingWeight: {
    minWidth: 150,
    maxWidth: 150,
  },
  initial: {
    minWidth: 150,
    maxWidth: 150,
  },
  increments: {
    minWidth: 150,
    maxWidth: 150,
  },
  price: {
    flexGrow: 1,
    minWidth: 240,
  },
  bottom: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: theme.spacing(2),
  },
  icon: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
  listItem: {
    paddingBottom: theme.spacing(1),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  listItemName: {
    fontWeight: 400,
  },
  title: {
    margin: "auto",
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
  },
});
