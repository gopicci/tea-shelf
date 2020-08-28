import React, { ReactElement, useContext } from "react";
import { Button, DialogActions, DialogContent } from "@material-ui/core";
import DetailsBoxMain from "./details-box-main";
import DetailsBoxNotes from "./details-box-notes";
import DetailsBoxOrigin from "./details-box-origin";
import DetailsBoxDescription from "./details-box-description";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import { Route } from "../../../app";
import { TeaRequest } from "../../../services/models";
import { CategoriesState } from "../../statecontainers/categories-context";

/**
 * DesktopDetailsLayout props.
 *
 * @memberOf DesktopDetailsLayout
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Mobile tea details page layout.
 *
 * @component
 * @subcategory Details desktop
 */
function DesktopDetailsLayout({
  route,
  setRoute,
  handleEdit,
}: Props): ReactElement {
  const classes = desktopDetailsStyles();
  const categories = useContext(CategoriesState);

  const teaData = route.payload;

  const category = Object.values(categories).find(
    (value) => value.id === teaData?.category
  );

  /** Routes to main. */
  function handleClose(): void {
    setRoute({ route: "MAIN" });
  }

  /** Routes to edit. */
  function handleEditClick(): void {
    setRoute({ route: "EDIT", payload: teaData });
  }

  return (
    <>
      {teaData && (
        <DialogContent className={classes.content}>
          <DetailsBoxMain teaData={teaData} handleEdit={handleEdit} />
          <DetailsBoxNotes teaData={teaData} handleEdit={handleEdit} />
          {teaData.origin && <DetailsBoxOrigin origin={teaData.origin} />}
          {(teaData.subcategory?.description || category?.description) && (
            <DetailsBoxDescription teaData={teaData} />
          )}
        </DialogContent>
      )}
      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} aria-label="close">
          Close
        </Button>
        <Button onClick={handleEditClick} aria-label="edit">
          Edit
        </Button>
      </DialogActions>
    </>
  );
}

export default DesktopDetailsLayout;
