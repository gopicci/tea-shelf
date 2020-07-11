import { makeStyles, fade } from "@material-ui/core/styles";

import { mainTheme as theme } from "./MainTheme";

export const formListStyles = makeStyles({
  formLabel: {
    display: "flex",
    padding: theme.spacing(1),
    background: fade(theme.palette.primary.light, 0.15),
  },
  formLabelText: {
    flexGrow: 1,
    textTransform: "capitalize",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
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
    width: "100vw",
    textTransform: "capitalize",
  },
  listItemBox: {
    display: "flex",
    flexGrow: 1,
    minWidth: 0,
    margin: 0,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.15)}`,
  },
  linkSmall: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
    fontWeight: "bold",
    color: `${theme.palette.primary.main}`,
    cursor: "pointer",
  },
});
