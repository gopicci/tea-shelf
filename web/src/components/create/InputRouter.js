import React, { useState } from "react";

import InputLayout from "./InputLayout";
import EditText from "./EditText";
import EditYear from "./EditYear";
import EditCategory from "./EditCategory";
import EditOrigin from "./EditOrigin";
import EditSubcategory from "./EditSubcategory";
import EditVendor from "./EditVendor";
import EditTemperature from "./EditTemperature";
import EditWeight from "./EditWeight";
import EditTime from "./EditTime";

export default function InputRouter(props) {
  const [editRoute, setEditRoute] = useState({
    route: "INPUT_LIST",
    field: null,
    data: null,
  });

  const handleBackToLayout = () =>
    setEditRoute({ route: "INPUT_LIST", field: null, data: null });

  const inputProps = { setEditRoute, handleBackToLayout, ...props };

  function renderSwitch(editRoute) {
    switch (editRoute.route) {
      case "INPUT_LIST":
        return <InputLayout {...inputProps} />;
      case "EDIT_TEXT":
        return <EditText {...inputProps} field={editRoute.field} />;
      case "EDIT_CATEGORY":
        return <EditCategory {...inputProps} field={editRoute.field} />;
      case "EDIT_LIST":
        return <EditYear {...inputProps} field={editRoute.field} />;
      case "EDIT_SUBCATEGORY":
        return <EditSubcategory {...inputProps} field={editRoute.field} />;
      case "EDIT_ORIGIN":
        return <EditOrigin {...inputProps} field={editRoute.field} />;
      case "EDIT_VENDOR":
        return <EditVendor {...inputProps} field={editRoute.field} />;
      case "EDIT_TEMPERATURE":
        return <EditTemperature {...inputProps} field={editRoute.field} />;
      case "EDIT_WEIGHT":
        return (
          <EditWeight
            {...inputProps}
            field={editRoute.field}
            data={editRoute.data}
          />
        );
      case "EDIT_TIME":
        return <EditTime {...inputProps} field={editRoute.field} />;
      default:
        return <InputLayout {...inputProps} />;
    }
  }

  return <>{renderSwitch(editRoute)}</>;
}
