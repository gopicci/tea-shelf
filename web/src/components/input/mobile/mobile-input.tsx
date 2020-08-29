import React, { ReactElement, useEffect, useState } from "react";
import InputLayout from "./input-layout";
import EditName from "./edit-name";
import EditYear from "./edit-year";
import EditCategory from "./edit-category";
import EditOrigin from "./edit-origin";
import EditSubcategory from "./edit-subcategory";
import EditVendor from "./edit-vendor";
import EditTemperature from "./edit-temperature";
import EditWeightList from "./edit-weight-list";
import EditWeightInput from "./edit-weight-input";
import EditTime from "./edit-time";
import EditPrice from "./edit-price";
import { Route } from "../../../app";
import { TeaInstance, TeaModel, TeaRequest } from "../../../services/models";

/**
 * Defines props passed to mobile input components.
 *
 * @memberOf MobileInput
 */
export type InputProps = {
  /** Sets mobile input layout route */
  handleBackToLayout: () => void;
  /** Input tea state */
  teaData: TeaRequest;
  /** Sets input tea state */
  setTeaData: (teaData: TeaRequest) => void;
};

/**
 * MobileInput props.
 *
 * @memberOf MobileInput
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Base64 image data from capture image stage */
  imageData?: string;
  /** Vision parser state with data extracted from the captured image */
  visionData?: TeaModel;
  /** Handles tea posting process */
  handleEdit: (data: TeaRequest, id?: number | string) => void;
  /** Closes editor and return to main route */
  handleClose: () => void;
  /** Routes to previous stage */
  handlePrevious: (payload?: TeaInstance) => void;
};

/**
 * Main mobile tea editing component. Keeps input state, handles save and
 * routes to input components.
 *
 * @component
 * @subcategory Mobile input
 */
function MobileInput({
  route,
  imageData,
  visionData,
  handleEdit,
  handleClose,
  handlePrevious,
}: Props): ReactElement {
  const [editRoute, setEditRoute] = useState("input_layout");

  const [teaData, setTeaData] = useState<TeaRequest>({
    id: undefined,
    name: "",
    category: 0,
    ...visionData,
    ...route.payload,
  });

  useEffect(() => {
    console.log(teaData);
  }, [teaData]);

  /**
   * Checks field requirements, merges image data and
   * calls edit handler.
   */
  function handleSave(): void {
    if (!teaData.name || !teaData.category) return;

    if (imageData) teaData.image = imageData;

    if (teaData.subcategory && !teaData.subcategory.category)
      teaData.subcategory.category = teaData.category;

    if (route.payload) {
      handleEdit(teaData, route.payload.id);
      handlePrevious({ ...teaData, id: route.payload.id });
    } else {
      handleEdit(teaData);
      handleClose();
    }
  }

  /** Sets edit route to input layout component */
  function handleBackToLayout() {
    setEditRoute("input_layout");
  }

  const inputProps: InputProps = { handleBackToLayout, teaData, setTeaData };

  function renderSwitch(editRoute: string) {
    switch (editRoute) {
      case "input_layout":
        return (
          <InputLayout
            {...inputProps}
            handleSave={handleSave}
            handlePrevious={() =>
              handlePrevious(
                route.payload && { ...teaData, id: route.payload.id }
              )
            }
            setEditRoute={setEditRoute}
          />
        );
      case "name":
        return <EditName {...inputProps} />;
      case "category":
        return <EditCategory {...inputProps} />;
      case "subcategory":
        return <EditSubcategory {...inputProps} />;
      case "year":
        return <EditYear {...inputProps} />;
      case "origin":
        return <EditOrigin props={inputProps} />;
      case "vendor":
        return <EditVendor {...inputProps} />;
      case "gongfu_temperature":
      case "western_temperature":
        return <EditTemperature {...inputProps} route={editRoute} />;
      case "gongfu_weight":
        return (
          <EditWeightList
            {...inputProps}
            route={editRoute}
            settings={{ max: 10, increment: 0.5 }}
          />
        );
      case "western_weight":
        return (
          <EditWeightList
            {...inputProps}
            route={editRoute}
            settings={{ max: 2, increment: 0.1 }}
          />
        );
      case "gongfu_initial":
      case "gongfu_increments":
      case "western_initial":
      case "western_increments":
        return <EditTime {...inputProps} route={editRoute} />;
      case "weight":
        return <EditWeightInput {...inputProps} />;
      case "price":
        return <EditPrice {...inputProps} />;
      default:
        return (
          <InputLayout
            {...inputProps}
            handleSave={handleSave}
            handlePrevious={handlePrevious}
            setEditRoute={setEditRoute}
          />
        );
    }
  }

  return renderSwitch(editRoute);
}

export default MobileInput;
