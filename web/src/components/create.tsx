import React, {ReactElement, useContext, useState} from 'react';
import localforage from "localforage";
//import CaptureImage from "./input/mobile/CaptureImage";
import LoadImage from "./input/desktop/load-image";
//import InputRouter from "./input/mobile/InputRouter";
import InputForm from "./input/desktop/input-form";
import { APIRequest } from "../services/auth-services";
import { generateUniqueId } from "../services/sync-services";
import { SnackbarDispatch} from './statecontainers/snackbar-context';
import { TeaDispatch } from "./statecontainers/tea-context";
import { SubcategoriesDispatch } from "./statecontainers/subcategories-context";
import { VendorsDispatch } from "./statecontainers/vendors-context";
import {Route} from '../app';
import {TeaModel, TeaRequest} from '../services/models';

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
 * @subcategory Main
 */
function Create({ setRoute, isMobile }: Props): ReactElement {
  const [teaData, setTeaData] = useState(undefined);
  const [imageData, setImageData] = useState("");

  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  /**
   * Handles posting process
   *
   * @param data {Object} Tea data
   */
  async function handleCreate(data: TeaRequest): Promise<void> {
    let reqData = data;

    let customSubcategory = false;
    let customVendor = false;

    try {
      if (imageData) reqData["image"] = imageData;

      // Clear nested fields
      if (!reqData.subcategory?.name) reqData.subcategory = undefined;
      else if (!reqData.subcategory.category) customSubcategory = true;

      if (!reqData.vendor?.name) reqData.vendor = undefined;
      else if (!reqData.vendor.popularity) customVendor = true;

      if (!reqData.origin?.country) reqData.origin = undefined;

      //reqData = teaSerializer(reqData);

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
        const offlineTeas = await localforage.getItem<TeaModel[]>("offline-teas");

        const teaInstance: TeaModel = {
          ...reqData,
          id: generateUniqueId(offlineTeas)
        };

        const cache = await localforage.setItem<TeaModel[]>("offline-teas", [
          ...offlineTeas,
          teaInstance,
        ]);
        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally",
        });
        teaDispatch({ type: "ADD", data: teaInstance });
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
  function handleNext(): void {
    setStep(step + 1);
  }

  /**
   * Sets previous creation step.
   *
   * @callback handlePrevious
   */
  function handlePrevious(): void {
    setStep(step - 1);
  }

  /**
   * Cancels creation process and returns to main route.
   *
   * @callback handleClose
   */
  function handleClose(): void {
    //setTeaData(teaModel);
    setStep(1);
    setRoute({ route: "MAIN" });
  }

  const props = {
    imageData,
    setImageData,
    teaData,
    handleNext,
    handlePrevious,
    handleClose,
    handleCreate,
  };

  function renderSwitch(step: number): ReactElement {
    switch (step) {
      case 1:
        return  <LoadImage {...props} />;
      case 2:
        return <InputForm {...props} />;
      default:
        return <LoadImage {...props} />;
    }
  }

  return renderSwitch(step);
}

export default Create;
