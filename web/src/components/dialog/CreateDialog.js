import React from "react";
import { Dialog } from "@material-ui/core";
import Create from "../Create";

export default function CreateDialog({ setDialog }) {
  return (
    <Dialog
      fullWidth
      open
      onClose={() => setDialog({ route: "", data: null })}
    >
      <Create desktop={true} setDialog={setDialog} />
    </Dialog>
  );
}
