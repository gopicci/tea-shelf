import React, { MouseEvent, ReactElement, useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActions,
  CardActionArea,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import { StarRate, MoreVert, Archive, Unarchive } from "@material-ui/icons";
import localforage from "localforage";
import ReactCountryFlag from "react-country-flag";
import {
  getOriginShortName,
  getSubcategoryName,
  getCountryCode,
  getCategoryName,
} from "../../services/parsing-services";
import { APIRequest } from "../../services/auth-services";
import { CategoriesState } from "../statecontainers/categories-context";
import { EditorContext } from "../editor";
import { TeaDispatch } from "../statecontainers/tea-context";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import emptyImage from "../../media/empty.png";
import { Route } from "../../app";
import { TeaInstance } from "../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down("sm")]: {
      borderRadius: 0,
    },
  },
  gridCard: {
    minHeight: 200,
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
    display: "flex",
    justifyContent: "left",
    alignItems: "stretch",
    height: theme.spacing(16),
    transition: theme.transitions.create("all", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.complex,
    }),
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
    color: "#ccc",
  },
  cardActions: {
    borderTop: `solid 1px ${theme.palette.divider}`,
  },
  category: {
    flexGrow: 1,
  },
}));

/**
 * TeaCard props.
 *
 * @memberOf TeaCard
 * @subcategory Main
 */
type Props = {
  /** Tea instance data */
  teaData: TeaInstance;
  /** Grid or list mode */
  gridView: boolean;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Card component visualizing a single tea instance.
 *
 * @component
 * @subcategory Main
 */
function TeaCard({ teaData, gridView, setRoute }: Props): ReactElement {
  const classes = useStyles();

  const handleEdit = useContext(EditorContext);
  const categories = useContext(CategoriesState);
  const teaDispatch = useContext(TeaDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>();

  /** Sets main route to tea details */
  function handleCardClick(): void {
    setRoute({ route: "TEA_DETAILS", payload: teaData });
  }

  /** Archives tea */
  function handleArchive(): void {
    handleEdit(
      { ...teaData, is_archived: true },
      teaData.id,
      "Tea successfully archived."
    );
  }

  /** Unarchives tea */
  function handleUnArchive(): void {
    handleEdit(
      { ...teaData, is_archived: false },
      teaData.id,
      "Tea successfully unarchived."
    );
  }

  /**
   *  Deletes tea instance.
   */
  async function handleDelete(): Promise<void> {
    try {
      if (typeof teaData.id === "string")
        // ID is UUID, delete online tea
        await APIRequest(`/tea/${teaData.id}/`, "DELETE");
      else {
        // ID is not UUID, delete offline tea
        const offlineTeas = await localforage.getItem<TeaInstance[]>(
          "offline-teas"
        );
        let newOfflineTeas = [];
        for (const tea of offlineTeas)
          if (tea.id !== teaData.id) newOfflineTeas.push(tea);
        await localforage.setItem("offline-teas", newOfflineTeas);
      }
      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully deleted" });
      teaDispatch({ type: "DELETE", data: teaData });
    } catch (e) {
      console.error(e);
      snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
    }
  }

  /**
   * Opens menu.
   *
   * @param {MouseEvent<HTMLElement>} event - Icon button click event
   */
  function handleMenuClick(event: MouseEvent<HTMLElement>): void {
    setAnchorEl(event.currentTarget);
  }

  /** Closes menu. */
  function handleMenuClose(): void {
    setAnchorEl(undefined);
  }

  return (
    <Card className={classes.root}>
      <CardActionArea
        className={gridView ? classes.gridCard : classes.listCard}
        onClick={handleCardClick}
        aria-label={teaData.name}
      >
        <img
          className={gridView ? classes.gridImage : classes.listImage}
          alt=""
          src={teaData.image ? teaData.image : emptyImage}
          crossOrigin="anonymous"
        />
        <CardContent className={classes.content}>
          <Box className={classes.topBox}>
            <Typography gutterBottom variant="h5">
              {teaData.name}
            </Typography>
            <Typography
              className={
                gridView ? classes.gridSubcategory : classes.listSubcategory
              }
              gutterBottom
              variant="subtitle1"
            >
              {teaData.year}{" "}
              {teaData.subcategory && getSubcategoryName(teaData.subcategory)}
            </Typography>
          </Box>
          <Box className={classes.bottomBox}>
            {teaData.rating !== undefined && teaData.rating > 0 && (
              <Box className={classes.ratingBox}>
                <StarRate className={classes.icon} />
                <Typography
                  className={classes.rating}
                  variant="body2"
                  component="span"
                >
                  {teaData.rating / 2}
                </Typography>
              </Box>
            )}
            {teaData.origin && (
              <>
                <Typography
                  className={classes.origin}
                  variant="body2"
                  component="span"
                >
                  {getOriginShortName(teaData.origin)}
                </Typography>
                <ReactCountryFlag
                  svg
                  className={classes.countryFlag}
                  style={{
                    width: "20px",
                    height: "20px",
                  }}
                  countryCode={getCountryCode(teaData.origin.country)}
                  alt=""
                  aria-label={teaData.origin.country}
                />
              </>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions className={classes.cardActions}>
        <Typography
          className={classes.category}
          variant="body2"
          component="span"
        >
          {categories && getCategoryName(categories, teaData.category)}
        </Typography>
        {teaData.is_archived ? (
          <IconButton
            onClick={handleUnArchive}
            size="small"
            aria-label="unarchive"
          >
            <Unarchive className={classes.icon} fontSize="small" />
          </IconButton>
        ) : (
          <IconButton onClick={handleArchive} size="small" aria-label="archive">
            <Archive className={classes.icon} fontSize="small" />
          </IconButton>
        )}
        <IconButton
          onClick={handleMenuClick}
          size="small"
          aria-label="unarchive"
        >
          <MoreVert className={classes.icon} aria-label="more" />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleDelete}>Delete tea</MenuItem>
        </Menu>
      </CardActions>
    </Card>
  );
}

export default TeaCard;
