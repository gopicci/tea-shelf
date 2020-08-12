import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DetailsAppBar from "./DetailsAppBar";
import DetailsCardMain from "./DetailsCardMain";
import DetailsCardNotes from "./DetailsCardNotes";
import DetailsCardOrigin from "./DetailsCardOrigin";

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
    background: theme.palette.background.main,
  },
}));

export default function TeaDetails({ setRoute, teaData, handleEdit }) {
  /**
   * Main mobile tea details page layout.
   *
   * @param setRoute {function} Set main route
   * @param teaData {json} Track the input state
   * @param handleEdit {function} Handle state edits
   */

  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <DetailsAppBar setRoute={setRoute} teaData={teaData} />
      {teaData && (
        <Box className={classes.page}>
          <DetailsCardMain
            setRoute={setRoute}
            teaData={teaData}
            handleEdit={handleEdit}
          />
          <DetailsCardNotes setRoute={setRoute} teaData={teaData} />
          {teaData.origin && <DetailsCardOrigin teaData={teaData} />}
        </Box>
      )}
    </Box>
  );
}
