import React, { ReactElement, useContext, useState } from "react";
import localforage from "localforage";
import MobileInput from "./input/mobile/mobile-input";
import MobileDetailsLayout from "./details/mobile/mobile-details-layout";
import DesktopDetailsLayout from './details/desktop/desktop-details-layout';
import InputForm from "./input/desktop/input-form";
import CaptureImage from "./input/mobile/capture-image";
import LoadImage from "./input/desktop/load-image";
import { APIRequest } from "../services/auth-services";
import { SnackbarDispatch } from "./statecontainers/snackbar-context";
import { TeaDispatch } from "./statecontainers/tea-context";
import { SubcategoriesDispatch } from "./statecontainers/subcategories-context";
import { VendorsDispatch } from "./statecontainers/vendors-context";
import { Route } from "../app";
import {
  SubcategoryModel,
  TeaInstance,
  TeaModel,
  TeaRequest,
  VendorModel,
} from "../services/models";
import { parseHMSToSeconds } from "../services/parsing-services";
import { generateUniqueId } from "../services/sync-services";

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
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  /**
   * Handles tea instance edit/creation process.
   *
   * @param {TeaRequest} data - Request data
   * @param {string|number} [id] - Instance ID for editing purposes
   */
  async function handleEdit(data: TeaRequest, id?: string | number) {
    let request = JSON.parse(JSON.stringify(data));

    let response;
    let image = "";
    let customSubcategory = !!(
      request.subcategory && !request.subcategory.category
    );
    let customVendor = !!(request.vendor && !request.vendor.popularity);

    try {
      // Convert brewing time from HH:MM:SS to seconds
      if (request.gongfu_brewing?.initial)
        request.gongfu_brewing.initial = String(
          parseHMSToSeconds(request.gongfu_brewing.initial)
        );
      if (request.western_brewing?.initial)
        request.western_brewing.initial = String(
          parseHMSToSeconds(request.western_brewing.initial)
        );
      if (request.gongfu_brewing?.increments)
        request.gongfu_brewing.increments = String(
          parseHMSToSeconds(request.gongfu_brewing.increments)
        );
      if (request.western_brewing?.increments)
        request.western_brewing.increments = String(
          parseHMSToSeconds(request.western_brewing.increments)
        );

      if (id) {
        // Editing an existing tea instance

        // Update context with request
        teaDispatch({ type: "EDIT", data: { ...request, id: id } });

        // Remove image data
        if (request.image) {
          image = request.image;
          delete request.image;
        }

        // Remove null fields
        Object.keys(request).forEach(
          (key) => request[key] === null && delete request[key]
        );

        console.log("r", request);

        if (typeof id === "string")
          // UUID: editing online tea
          response = await APIRequest(
            `/tea/${id}/`,
            "PUT",
            JSON.stringify({ ...request, id: id })
          );
        else {
          // Non-UUID: editing offline tea
          response = await APIRequest(`/tea/`, "POST", JSON.stringify(request));
        }
      } else {
        // ID not provided, create a new instance
        console.log(request);
        console.log(JSON.stringify(request));
        response = await APIRequest("/tea/", "POST", JSON.stringify(request));
        console.log("Tea created: ", response);
      }

      const body = await response?.json();
      console.log(body);

      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully uploaded" });

      // Update context with response
      if (id) {
        teaDispatch({ type: "EDIT", data: body });
      } else teaDispatch({ type: "ADD", data: body });

      // If new subcategory was created update cache
      if (customSubcategory) {
        const subGetRes = await APIRequest("/subcategory/", "GET");
        const subGetData = await subGetRes.json();
        subcategoriesDispatch({ type: "SET", data: subGetData });
        await localforage.setItem<SubcategoryModel[]>(
          "subcategories",
          subGetData
        );
      }

      // If new vendor was created update cache
      if (customVendor) {
        const venGetRes = await APIRequest("/vendor/", "GET");
        const venGetData = await venGetRes.json();
        vendorsDispatch({ type: "SET", data: venGetData });
        await localforage.setItem<VendorModel[]>("vendors", venGetData);
      }

    } catch (e) {
      console.error(e);
      if (e.message === "Bad Request") {
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
        if (id && route.payload) {
          // Revert context to initial state
          teaDispatch({ type: "EDIT", data: route.payload });
        }
      } else {
        console.log(e.message, "cache locally");

        let offlineTeas = await localforage.getItem<TeaInstance[]>(
          "offline-teas"
        );
        if (!offlineTeas) await localforage.setItem("offline-teas", []);

        if (image) request["image"] = image;
        if (!id) id = generateUniqueId(offlineTeas);

        let teaInstance: TeaInstance = { ...request, id: id };

        // Update context with offline instance
        if (id) {
          teaDispatch({ type: "EDIT", data: teaInstance });
        } else teaDispatch({ type: "ADD", data: teaInstance });

        // If tea already present in cache remove before adding again
        for (const tea of offlineTeas)
          if (tea.id === id) offlineTeas.splice(offlineTeas.indexOf(tea), 1);

        const cache = await localforage.setItem<TeaInstance[]>("offline-teas", [
          ...offlineTeas,
          teaInstance,
        ]);

        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally",
        });
        console.log("offline teas:", cache);
      }
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
