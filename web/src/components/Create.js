import React, { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import CaptureImage from "./input/mobile/CaptureImage";
import InputRouter from "./input/mobile/InputRouter";
import { APIRequest } from "../services/AuthService";
import { generateUniqueId } from "../services/SyncService";
import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { TeaDispatch } from "./statecontainers/TeasContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";
import { VendorsDispatch } from "./statecontainers/VendorsContext";
import {teaModel, teaSerializer} from '../services/Serializers';

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
}));

export default function Create({ setRoute }) {
  /**
   * Mobile tea entry creation process. Consists of 3 stages:
   * captureImage -> inputLayout -> handleCreate
   *
   * teaData tracks the input state.
   *
   * @param setRoute {function} Set main route
   */

  const classes = useStyles();

  const [teaData, setTeaData] = useState(teaModel);
  const [imageData, setImageData] = useState(null);

  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  async function handleCreate() {
    // Handle posting process

    let reqData = { ...teaData };

    let customSubcategory = false;
    let customVendor = false;

    try {
      delete reqData.id;

      if (imageData) reqData["image"] = imageData;

      if (reqData.subcategory)
        if (!reqData.subcategory.category) customSubcategory = true;

      if (reqData.vendor) if (!reqData.vendor.popularity) customVendor = true;

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
          data: "Offline mode, tea saved locally",
        });
        teaDispatch({ type: "ADD", data: reqData });
        console.log("offline teas:", cache);
      }
    }
  }

  const [step, setStep] = useState(1);

  function handleNext() {
    setStep(step + 1);
  }

  function handlePrevious() {
    setStep(step - 1);
  }

  function handleClose() {
    setTeaData(teaModel);
    setStep(1);
    setRoute({ route: "MAIN" });
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
        return <CaptureImage {...props} />;
      case 2:
        return <InputRouter {...props} />;
      default:
        return <CaptureImage {...props} />;
    }
  }

  return <Box className={classes.root}>{renderSwitch(step)}</Box>;
}
