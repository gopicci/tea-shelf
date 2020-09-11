import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Button, DialogActions, DialogContent } from "@material-ui/core";
import DetailsBoxMain from "./details-box-main";
import DetailsBoxNotes from "./details-box-notes";
import DetailsBoxOrigin from "./details-box-origin";
import DetailsBoxDescription from "./details-box-description";
import ActionIcons from "../../generics/actionIcons";
import { desktopDetailsStyles } from "../../../style/desktop-details-styles";
import { CategoriesState } from "../../statecontainers/categories-context";
import { TeasState } from "../../statecontainers/tea-context";
import { EditorContext, HandleEdit } from "../../editor";
import { Route } from "../../../app";
import { TeaInstance } from "../../../services/models";

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
};

/**
 * Mobile tea details page layout.
 *
 * @component
 * @subcategory Details desktop
 */
function DesktopDetailsLayout({ route, setRoute }: Props): ReactElement {
  const classes = desktopDetailsStyles();

  const handleEdit: HandleEdit = useContext(EditorContext);
  const categories = useContext(CategoriesState);
  const teas = useContext(TeasState);

  const [teaData, setTeaData] = useState<TeaInstance | undefined>();

  useEffect(() => {
    setTeaData(Object.values(teas).find((tea) => tea.id === route.payload?.id));
  }, [route.payload, teas]);

  const category = Object.values(categories).find(
    (value) => value.id === teaData?.category
  );

  /** Routes to main. */
  function handleClose(): void {
    setRoute({ route: "MAIN" });
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
        {teaData && <ActionIcons teaData={teaData} setRoute={setRoute} />}
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </>
  );
}

export default DesktopDetailsLayout;
