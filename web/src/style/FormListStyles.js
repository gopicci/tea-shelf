import {makeStyles, fade} from '@material-ui/core/styles';

import {mainTheme as theme} from './MainTheme'

export const formListStyles = makeStyles({
  formLabel: {
    display: 'flex',
    padding: theme.spacing(1),
    background: fade(theme.palette.primary.light, 0.15),
  },
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  linkSmall: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontSize: 10,
    fontWeight: 'bold',
    color: `${theme.palette.primary.main}`,
    cursor: 'pointer',
  },
  entryName: {
    flexGrow: 1,
    textTransform: 'capitalize',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
  },
});