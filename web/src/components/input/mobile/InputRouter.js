import React, { useState } from "react";

import InputLayout from "./InputLayout";
import EditText from "./EditText";
import EditYear from "./EditYear";
import EditCategory from "./EditCategory";
import EditOrigin from "./EditOrigin";
import EditSubcategory from "./EditSubcategory";
import EditVendor from "./EditVendor";
import EditTemperature from "./EditTemperature";
import EditWeightList from "./EditWeightList";
import EditWeightInput from "./EditWeightInput";
import EditTime from "./EditTime";
import EditPrice from "./EditPrice";
import EditNotes from "./EditNotes";

/**
 * Defines mobile tea creation input stage routes.
 */
export default function InputRouter(props) {
  const [editRoute, setEditRoute] = useState(
    props.route === "EDIT_NOTES" ? "notes" : "input_layout"
  );

  function handleBackToLayout() {
    setEditRoute("input_layout");
  }

  const inputProps = { setEditRoute, handleBackToLayout, ...props };

  function renderSwitch(editRoute) {
    switch (editRoute) {
      case "input_layout":
        return <InputLayout {...inputProps} />;
      case "name":
        return <EditText {...inputProps} field={editRoute} />;
      case "category":
        return <EditCategory {...inputProps} field={editRoute} />;
      case "subcategory":
        return <EditSubcategory {...inputProps} field={editRoute} />;
      case "year":
        return <EditYear {...inputProps} field={editRoute} />;
      case "origin":
        return <EditOrigin {...inputProps} field={editRoute} />;
      case "vendor":
        return <EditVendor {...inputProps} field={editRoute} />;
      case "gongfu_temperature":
      case "western_temperature":
        return <EditTemperature {...inputProps} field={editRoute} />;
      case "gongfu_weight":
        return (
          <EditWeightList
            {...inputProps}
            field={editRoute}
            data={{ max: 10, increment: 0.5 }}
          />
        );
      case "western_weight":
        return (
          <EditWeightList
            {...inputProps}
            field={editRoute}
            data={{ max: 2, increment: 0.1 }}
          />
        );
      case "gongfu_initial":
      case "gongfu_increments":
      case "western_initial":
      case "western_increments":
        return <EditTime {...inputProps} field={editRoute} />;
      case "weight":
        return <EditWeightInput {...inputProps} field={editRoute} />;
      case "price":
        return <EditPrice {...inputProps} field={editRoute} />;
      case "notes":
        return <EditNotes {...inputProps} />;
      default:
        return <InputLayout {...inputProps} />;
    }
  }

  return renderSwitch(editRoute);
}
