import React, {ReactElement, useState} from 'react';
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DetailsAppBar from "./details-app-bar";
import DetailsCardMain from "./details-card-main";
import DetailsCardNotes from "./details-card-notes";
import DetailsCardOrigin from "./details-card-origin";
import DetailsCardVendor from "./details-card-vendor";
import DetailsCardDescription from "./details-card-description";
import { Route } from "../../../app";
import {TeaInstance, TeaRequest} from '../../../services/models';
import EditNotes from './edit-notes';

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
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
};

/**
 * Mobile tea details page layout.
 *
 * @component
 * @subcategory Details mobile
 */
function MobileDetailsLayout({ route, setRoute, handleEdit }: Props): ReactElement {
  const classes = useStyles();

  const [teaData, setTeaData] = useState<TeaInstance>(route.payload as TeaInstance);

  return (
    <>
      {teaData && route.route === "EDIT_NOTES" ? (
        <EditNotes
          teaData={teaData}
          setTeaData={setTeaData}
          handleEdit={handleEdit}
          setRoute={setRoute}
          />
        )
        : (
        <Box className={classes.root}>
          <DetailsAppBar setRoute={setRoute} teaData={teaData} />
          <Box className={classes.page}>
            <DetailsCardMain
              setRoute={setRoute}
              teaData={teaData}
              handleEdit={handleEdit}
            />
            <DetailsCardNotes setRoute={setRoute} teaData={teaData} />
            {teaData.origin && <DetailsCardOrigin origin={teaData.origin} />}
            {teaData.vendor && <DetailsCardVendor vendor={teaData.vendor} />}
            <DetailsCardDescription teaData={teaData} />
          </Box>
        </Box>
      )}
    </>
  );
}

export default MobileDetailsLayout;
