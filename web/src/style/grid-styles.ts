import { makeStyles, fade } from "@material-ui/core/styles";
import { mainTheme as theme } from "./main-theme";

export const gridStyles = makeStyles({
  root: {
    margin: "auto",
    padding: theme.spacing(2),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  cardPulse: {
    animationName: "$pulse",
    animationDuration: "1.0s",
    animationDirection: "alternate",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },
  "@keyframes pulse": {
    "100%": {
      backgroundColor: theme.palette.action.selected,
    },
  },
  gridRoot: {
    maxWidth: "100%",
    padding: 0,
  },
  listRoot: {
    maxWidth: 600,
    padding: 0,
  },
  gridItem: {
    minWidth: 240,
    maxWidth: 240,
    display: "flex",
    padding: theme.spacing(2),
    "& .MuiPaper-root": {
      display: "flex",
      flexGrow: 1,
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listItem: {
    width: "100%",
    padding: theme.spacing(1),
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(0.5),
      paddingTop: theme.spacing(1),
    },
    "& .MuiPaper-root": {
      display: "flex",
      flexGrow: 1,
    },
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  sortByBox: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "center",
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down("sm")]: {
      paddingTop: theme.spacing(1),
    },
    "& .MuiButtonBase-root": {
      padding: 0,
    },
  },
  reverseButton: {
    display: "flex",
    cursor: "pointer",
  },
  sortByText: {
    flexGrow: 1,
    margin: "auto",
  },
  gridCard: {
    position: "relative",
    minHeight: 200,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "top",
    alignItems: "stretch",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listCard: {
    position: "relative",
    display: "flex",
    justifyContent: "left",
    alignItems: "stretch",
    height: theme.spacing(16),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  dateCard: {
    display: "flex",
    flexGrow: 1,
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  centerContent: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledCard: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: fade(theme.palette.background.default, 0.7),
    border: 0,
  },
  gridImage: {
    height: 120,
    width: "100%",
    objectFit: "cover",
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  listImage: {
    width: theme.spacing(10),
    height: "100px",
    objectFit: "cover",
    margin: theme.spacing(2),
    marginRight: 0,
    borderRadius: 4,
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    paddingBottom: theme.spacing(1),
  },
  topBox: {
    flexGrow: 1,
  },
  gridSubcategory: {
    fontStyle: "italic",
    paddingBottom: theme.spacing(4),
  },
  listSubcategory: {
    fontStyle: "italic",
  },
  bottomBox: {
    display: "flex",
  },
  origin: {
    flexGrow: 1,
    margin: "auto",
    textAlign: "right",
  },
  ratingBox: {
    display: "flex",
    flexShrink: 1,
  },
  rating: {
    margin: "auto",
  },
  countryFlag: {
    fontSize: theme.typography.body2.fontSize,
    paddingLeft: theme.spacing(0.5),
    margin: "auto",
  },
  icon: {
    color: theme.palette.text.secondary,
  },
  extraTopPadding: {
    paddingTop: theme.spacing(6),
  },
  rowSpace: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-between",
  },
});
