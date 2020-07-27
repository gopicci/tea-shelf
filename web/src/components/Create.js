import React, { useContext, useState } from "react";
import {Box} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import localforage from "localforage";
import CaptureImage from "./create/CaptureImage";
import InputRouter from "./create/InputRouter";
import { APIRequest } from "../services/AuthService";
import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { TeaDispatch } from "./statecontainers/TeasContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";
import { VendorsDispatch } from "./statecontainers/VendorsContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "100vh",
    display: "flex",
    margin: 0,
    flexDirection: "column",
  },
}));

// Defines tea data structure in API format
const initialState = {
  image: null,
  name: "",
  category: null,
  subcategory: null,
  origin: null,
  vendor: null,
  is_archived: false,
  gongfu_brewing: null,
  western_brewing: null,
  year: null,
  gongfu_preferred: false,
  price: null,
  weight_left: null,
  weight_consumed: null,
  rating: null,
  notes: "",
};

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

  const [teaData, setTeaData] = useState(initialState);
  const [imageData, setImageData] = useState(null);

  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  async function handleCreate() {
    // Handle posting process

    let customSubcategory = false;
    let customVendor = false;

    try {
      if (imageData) teaData["image"] = imageData;

      if (teaData.subcategory) {
        if (!teaData.subcategory.category) customSubcategory = true;
        teaData.subcategory = {
          name: teaData.subcategory.name,
          category: teaData.category,
        };
      }

      if (teaData.vendor) if (!teaData.vendor.popularity) customVendor = true;

      if (teaData.year === "unknown") teaData.year = null;

      console.log(teaData);
      console.log(JSON.stringify(teaData));
      const res = await APIRequest("/tea/", "POST", JSON.stringify(teaData));
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
        const cache = await localforage.setItem("offline-teas", [
          ...offlineTeas,
          teaData,
        ]);
        snackbarDispatch({
          type: "WARNING",
          data: "Offline mode, tea saved locally",
        });
        teaDispatch({ type: "ADD", data: teaData });
        console.log("offline teas:", cache);
      }
    }
  }

  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);

  const handlePrevious = () => setStep(step - 1);

  const handleClose = () => {
    setTeaData(initialState);
    setStep(1);
    setRoute("MAIN");
  };

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
