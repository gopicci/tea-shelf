import React from "react";
import { Dialog } from "@material-ui/core";
import Edit from "../Edit";
import Create from "../Create";

export default function DialogLayout(props) {
  const { router, setRouter } = props;

  function handleClose() {
    setRouter({ route: "MAIN" });
  }

  return (
    <Dialog
      fullWidth
      maxWidth={router.route === "TEA_DETAILS" ? "md" : "sm"}
      open={true}
      onClose={handleClose}
    >
      {router.route === "CREATE" ? <Create {...props} /> : <Edit {...props} />}
    </Dialog>
  );
}
