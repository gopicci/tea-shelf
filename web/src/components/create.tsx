import React, {ReactElement, useContext, useState} from 'react';
import localforage from "localforage";
import CaptureImage from "./input/mobile/CaptureImage";
import LoadImage from "./input/desktop/LoadImage";
import InputRouter from "./input/mobile/InputRouter";
import InputForm from "./input/desktop/InputForm";
import { APIRequest } from "../services/AuthService";
import { generateUniqueId } from "../services/SyncService";
import { teaModel, teaSerializer } from "../services/Serializers";
import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { TeaDispatch } from "./statecontainers/TeasContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";
import { VendorsDispatch } from "./statecontainers/VendorsContext";
import {Route} from '../app';

/**
 * Create props.
 *
 * @memberOf Create
 */
type Props = {
  /** Set app's main route */
  setRoute: (route: Route) => void;
  /** Mobile mode or desktop */
  isMobile: boolean;
};


/**
 * Handles creation process, which consists of 3 stages:
 * captureImage -> inputLayout -> handleCreate
 *
 * @component
 */
function Create({ setRoute, isMobile }: Props): ReactElement {
  const [teaData, setTeaData] = useState(teaModel);
  const [imageData, setImageData] = useState(null);

  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  /**
   * Handles posting process
   *
   * @param data {Object} Tea data
   */
  async function handleCreate(data) {
    let reqData = data;

    let customSubcategory = false;
    let customVendor = false;

    try {
      delete reqData.id;

      if (imageData) reqData["image"] = imageData;

      // Clear nested fields
      if (!reqData.subcategory.name) reqData.subcategory = null;
      else if (!reqData.subcategory.category) customSubcategory = true;

      if (!reqData.vendor.name) reqData.vendor = null;
      else if (!reqData.vendor.popularity) customVendor = true;

      if (!reqData.origin.country) reqData.origin = null;

      reqData = teaSerializer(reqData);

      console.log(reqData);
      console.log(JSON.stringify(reqData));
      const res = await APIRequest("/tea/", "POST", JSON.stringify(reqData));
      console.log("Tea created: ", res);
      const body = await res.json();
      console.log(body);

      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully created" });

      // Update tea context with newly added
      teaDispatch({ type: "ADD", data: body });

      // If new subcategory was created update cache
      if (customSubcategory) {
        const subGetRes = await APIRequest("/subcategory/", "GET");
        const subGetData = await subGetRes.json();
        subcategoriesDispatch({ type: "SET", data: subGetData });
        await localforage.setItem("subcategories", subGetData);
      }

      // If new vendor was created update cache
      if (customVendor) {
        const venGetRes = await APIRequest("/vendor/", "GET");
        const venGetData = await venGetRes.json();
        vendorsDispatch({ type: "SET", data: venGetData });
        await localforage.setItem("vendors", venGetData);
      }
    } catch (e) {
      console.error(e);
      if (e.message === "Bad Request") {
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      } else {
        console.log(e.message, "cache locally");
        const offlineTeas = await localforage.getItem("offline-teas");

        reqData["id"] = generateUniqueId(offlineTeas);

        const cache = await localforage.setItem("offline-teas", [
          ...offlineTeas,
          reqData,
        ]);
        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally",
        });
        teaDispatch({ type: "ADD", data: reqData });
        console.log("offline teas:", cache);
      }
    }
  }

  /**
   * Sets creation process step.
   *
   * @callback setStep
   * @param step {1|2}
   */
  const [step, setStep] = useState(1);

  /**
   * Set next creation step.
   *
   * @callback handleNext
   */
  function handleNext() {
    setStep(step + 1);
  }

  /**
   * Sets previous creation step.
   *
   * @callback handlePrevious
   */
  function handlePrevious() {
    setStep(step - 1);
  }

  /**
   * Cancels creation process and returns to main route.
   *
   * @callback handleClose
   */
  function handleClose() {
    setTeaData(teaModel);
    setStep(1);
    setRouter({ route: "MAIN" });
  }

  const props = {
    imageData,
    setImageData,
    teaData,
    setTeaData,
    handleNext,
    handlePrevious,
    handleClose,
    handleCreate,
  };

  function renderSwitch(step) {
    switch (step) {
      case 1:
        return isMobile ? (
          <CaptureImage {...props} />
        ) : (
          <LoadImage {...props} />
        );
      case 2:
        return isMobile ? <InputRouter {...props} /> : <InputForm {...props} />;
      default:
        return isMobile ? (
          <CaptureImage {...props} />
        ) : (
          <LoadImage {...props} />
        );
    }
  }

  return renderSwitch(step);
}

export default Create;
