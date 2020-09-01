import React, { ReactElement, useContext, useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DetailsAppBar from "./details-app-bar";
import DetailsCardMain from "./details-card-main";
import DetailsCardNotes from "./details-card-notes";
import DetailsCardOrigin from "./details-card-origin";
import DetailsCardVendor from "./details-card-vendor";
import DetailsCardDescription from "./details-card-description";
import EditNotes from "./edit-notes";
import { TeasState } from "../../statecontainers/tea-context";
import { EditorContext, HandleEdit } from "../../editor";
import { Route } from "../../../app";
import { TeaInstance } from "../../../services/models";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
  page: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    flexShrink: 0,
    background: theme.palette.background.default,
  },
}));

/**
 * MobileDetailsLayout props.
 *
 * @memberOf MobileDetailsLayout
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
 * @subcategory Details mobile
 */
function MobileDetailsLayout({ route, setRoute }: Props): ReactElement {
  const classes = useStyles();

  const handleEdit: HandleEdit = useContext(EditorContext);
  const teas = useContext(TeasState);

  const [teaData, setTeaData] = useState<TeaInstance | undefined>();

  useEffect(() => {
    setTeaData(Object.values(teas).find((tea) => tea.id === route.payload?.id));
  }, [route.payload, teas]);

  return (
    <>
      {teaData &&
        (route.route === "EDIT_NOTES" ? (
          <EditNotes
            teaData={teaData}
            handleEdit={handleEdit}
            setRoute={setRoute}
          />
        ) : (
          <Box className={classes.root}>
            <DetailsAppBar setRoute={setRoute} teaData={teaData} />
            <Box className={classes.page}>
              <DetailsCardMain teaData={teaData} handleEdit={handleEdit} />
              <DetailsCardNotes setRoute={setRoute} teaData={teaData} />
              {teaData.origin && <DetailsCardOrigin origin={teaData.origin} />}
              {teaData.vendor && <DetailsCardVendor vendor={teaData.vendor} />}
              <DetailsCardDescription teaData={teaData} />
            </Box>
          </Box>
        ))}
    </>
  );
}

export default MobileDetailsLayout;
