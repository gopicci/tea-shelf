import React, { ReactElement, useContext, useState } from "react";
import localforage from "localforage";
import MobileInput from "./input/mobile/mobile-input";
import MobileDetailsLayout from "./details/mobile/mobile-details-layout";
import DesktopDetailsLayout from "./details/desktop/desktop-details-layout";
import InputForm from "./input/desktop/input-form";
import CaptureImage from "./input/mobile/capture-image";
import LoadImage from "./input/desktop/load-image";
import {
  generateUniqueId,
  getOfflineTeas,
  uploadInstance,
} from "../services/sync-services";
import { SnackbarDispatch } from "./statecontainers/snackbar-context";
import { TeaDispatch } from "./statecontainers/tea-context";
import {
  SubcategoriesDispatch,
  SubcategoriesState,
} from "./statecontainers/subcategories-context";
import {
  VendorsDispatch,
  VendorsState,
} from "./statecontainers/vendors-context";
import { SyncDispatch } from "./statecontainers/sync-context";
import { Route } from "../app";
import {
  SubcategoryModel,
  TeaInstance,
  TeaModel,
  TeaRequest,
  VendorModel,
} from "../services/models";
import validator from "validator";

/**
 * Editor props.
 *
 * @memberOf Editor
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};

/**
 * Wrapper for components that need access to tea instance editing.
 * Handles editing and creation process.
 *
 * @component
 * @subcategory Main
 */
function Editor({ route, setRoute, isMobile = true }: Props): ReactElement {
  const [imageData, setImageData] = useState("");
  const [visionData, setVisionData] = useState({} as TeaModel);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategories = useContext(SubcategoriesState);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendors = useContext(VendorsState);
  const vendorsDispatch = useContext(VendorsDispatch);
  const syncDispatch = useContext(SyncDispatch);

  /**
   * Handles tea instance edit/creation process. Updates state and saves instance locally
   * first. Then tries to sync local cache with API.
   *
   * @param {TeaRequest} teaData - Request data
   * @param {string|number} [id] - Instance ID for editing purposes
   */
  async function handleEdit(teaData: TeaRequest, id?: string | number) {
    try {
      let offlineTeas = await getOfflineTeas();

      // Update context with request
      if (id) teaDispatch({ type: "EDIT", data: { ...teaData, id: id } });
      else {
        id = generateUniqueId(offlineTeas);
        teaDispatch({ type: "ADD", data: { ...teaData, id: id } });
      }
      console.log("id", id);
      // If tea already present in cache remove before adding again
      for (const tea of offlineTeas)
        if (tea.id === id) offlineTeas.splice(offlineTeas.indexOf(tea), 1);

      await localforage.setItem<TeaInstance[]>("offline-teas", [
        ...offlineTeas,
        { ...teaData, id: id },
      ]);

      syncDispatch({ type: "SET_NOT_SYNCED" });

      // New subcategory, update context and cache
      if (teaData.subcategory && !subcategories.includes(teaData.subcategory)) {
        const subcategory = {
          ...teaData.subcategory,
          id: generateUniqueId(subcategories),
        };
        subcategoriesDispatch({
          type: "SET",
          data: subcategories.concat(subcategory),
        });
        await localforage.setItem<SubcategoryModel[]>(
          "subcategories",
          subcategories.concat(subcategory)
        );
      }

      // New vendor, update context and cache
      if (teaData.vendor && !vendors.includes(teaData.vendor)) {
        const vendor = { ...teaData.vendor, id: generateUniqueId(vendors) };
        vendorsDispatch({ type: "SET", data: vendors.concat(vendor) });
        await localforage.setItem<VendorModel[]>(
          "vendors",
          vendors.concat(vendor)
        );
      }

      // Upload through API
      const response = await uploadInstance({ ...teaData, id });
      const body = await response.json();

      // Update context
      teaDispatch({ type: "DELETE", data: { ...teaData, id } });
      teaDispatch({ type: "ADD", data: { ...teaData, id: body.id } });

      // Delete offline entry
      for (const tea of offlineTeas)
        if (tea.id === id) offlineTeas.splice(offlineTeas.indexOf(tea), 1);
      await localforage.setItem<TeaInstance[]>("offline-teas", offlineTeas);

      // Update sync status
      syncDispatch({ type: "SET_SYNCED" });

      // Notify on successful creation
      if (typeof id === "string" && validator.isUUID(id))
        snackbarDispatch({
          type: "SUCCESS",
          data: "Tea successfully created.",
        });
    } catch (e) {
      if (e.message === "Bad Request")
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      else
        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally.",
        });
    }
  }

  /**
   * Returns to tea details route or create route,
   * depending on payload.
   *
   * @param {TeaInstance} payload - Optional route payload
   */
  function handlePrevious(payload?: TeaInstance): void {
    if (payload) setRoute({ route: "TEA_DETAILS", payload: payload });
    else setRoute({ route: "CREATE" });
  }

  /**
   * Sets edit route.
   */
  function handleNext(): void {
    setRoute({ route: "EDIT" });
  }

  /**
   * Clears state and reroutes to main.
   */
  function handleClose(): void {
    setRoute({ route: "MAIN" });
  }

  const props = {
    route,
    setRoute,
    imageData,
    setImageData,
    visionData,
    setVisionData,
    handlePrevious,
    handleNext,
    handleEdit,
    handleClose,
  };

  /**
   * Returns component based on route.
   *
   * @returns {ReactElement}
   */
  function renderSwitch(): ReactElement {
    switch (route.route) {
      case "TEA_DETAILS":
      case "EDIT_NOTES":
        if (isMobile) return <MobileDetailsLayout {...props} />;
        else return <DesktopDetailsLayout {...props} />;
      case "EDIT":
        if (isMobile) return <MobileInput {...props} />;
        else return <InputForm {...props} />;
      case "CREATE":
        if (isMobile) return <CaptureImage {...props} />;
        else return <LoadImage {...props} />;
      default:
        if (isMobile) return <MobileDetailsLayout {...props} />;
        else return <DesktopDetailsLayout {...props} />;
    }
  }

  return renderSwitch();
}

export default Editor;
