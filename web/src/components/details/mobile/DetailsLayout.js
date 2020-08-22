import React from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DetailsAppBar from "./DetailsAppBar";
import DetailsCardMain from "./DetailsCardMain";
import DetailsCardNotes from "./DetailsCardNotes";
import DetailsCardOrigin from "./DetailsCardOrigin";
import DetailsCardVendor from './DetailsCardVendor';
import DetailsCardDescription from './DetailsCardDescription';

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

/**
 * Main mobile tea details page layout.
 *
 * @param setRouter {setRouter} Callback to set main route
 * @param teaData {Object} Track the input state
 * @param handleEdit {function} Handle state edits
 */
export default function TeaDetails({ setRouter, teaData, handleEdit }) {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <DetailsAppBar setRouter={setRouter} teaData={teaData} />
      {teaData && (
        <Box className={classes.page}>
          <DetailsCardMain
            setRouter={setRouter}
            teaData={teaData}
            handleEdit={handleEdit}
          />
          <DetailsCardNotes setRouter={setRouter} teaData={teaData} />
          {teaData.origin && <DetailsCardOrigin teaData={teaData} />}
          {teaData.vendor && <DetailsCardVendor teaData={teaData} />}
          <DetailsCardDescription teaData={teaData} />
        </Box>
      )}
    </Box>
  );
}
