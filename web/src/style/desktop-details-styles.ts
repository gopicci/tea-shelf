import { makeStyles } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const desktopDetailsStyles = makeStyles({
  content: {
    display: "flex",
    height: "100%",
    flexGrow: 1,
    flexDirection: "column",
    overflowY: "scroll",
    padding: theme.spacing(4),
    margin: 0,
  },
  actions: {
    margin: 0,
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  rowCenter: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    height: theme.spacing(1),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(4),
    margin: "auto",
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  label: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginBottom: theme.spacing(2),
    color: theme.palette.primary.main,
  },
  lineIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  teaImage: {
    minWidth: theme.spacing(28),
    maxWidth: theme.spacing(28),
    minHeight: theme.spacing(36),
    maxHeight: theme.spacing(36),
    objectFit: "cover",
    borderRadius: theme.spacing(0.75),
    marginTop: theme.spacing(2),
  },
  topBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    flexGrow: 1,
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(4),
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  vendor: {
    marginBottom: theme.spacing(2),
  },
  title: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    textTransform: "capitalize",
    marginBottom: theme.spacing(4),
  },
  category: {
    textTransform: "capitalize",
  },
  rowSpace: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ratingBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  ratingNumber: {
    marginRight: theme.spacing(1),
  },
  rating: {
    "& .MuiRating-iconFilled": {
      color: theme.palette.secondary.main,
    },
  },
  brewingBox: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    minWidth: 250,
    marginBottom: theme.spacing(2),
  },
  brewingTitle: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(1),
  },
  brewingSwitch: {
    position: "absolute",
    right: theme.spacing(2),
    top: "50%",
    transform: "translateY(-50%)",
  },
  smallTitle: {
    margin: "auto",
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  notesIcon: {
    color: theme.palette.primary.main,
  },
  notesPaper: {
    width: "66%",
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(10),
    padding: theme.spacing(2),
    border: `solid 1px ${theme.palette.divider}`,
  },
  notesText: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  doubleMargin: {
    margin: theme.spacing(2),
  },
  map: {
    marginTop: theme.spacing(2),
  },
  aboutBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  halfCenterBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  descriptionRow: {
    display: "flex",
    flexDirection: "row",
    marginTop: theme.spacing(12),
  },
  sourceLink: {
    textAlign: "right",
  },
  bottom: {
    background: theme.palette.background.paper,
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-between",
    margin: theme.spacing(2),
  },
  messageBox: {
    "&.MuiDialogContent-root:first-child": {
      padding: theme.spacing(6),
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});
