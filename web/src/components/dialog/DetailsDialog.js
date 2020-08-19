import React from "react";
import { Dialog } from "@material-ui/core";
import Edit from "../Edit";

export default function DetailsDialog({ data, setDialog }) {
  return (
    <Dialog
      fullWidth
      maxWidth='md'
      open
      onClose={() => setDialog({ route: "", data: null })}
    >
      <Edit
        initialState={data}
        details={true}
        desktop={true}
        setDialog={setDialog}
      />
    </Dialog>
  );
}
