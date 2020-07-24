import React, {useContext, useEffect, useState} from 'react';
import localforage from "localforage";

import CaptureImage from "./create/CaptureImage";
import InputRouter from "./create/InputRouter";
import { APIRequest } from "../services/AuthService";

import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";

export default function Create({ setRoute }) {
  const [imageData, setImageData] = useState(null);

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
  }

  const [teaData, setTeaData] = useState(initialState);

  useEffect(() => {
    console.log(teaData);
  }, [teaData]);


  const snackbarDispatch = useContext(SnackbarDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);

  async function handleCreate() {

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

      if (teaData.year === "unknown") teaData.year = null;

      console.log(teaData);
      console.log(JSON.stringify(teaData));
      const res = await APIRequest("/tea/", "POST", JSON.stringify(teaData));
      console.log("Tea created: ", res);
      console.log(await res.json());

      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully created" });

      // If new subcategory was created update cache
      if (customSubcategory) {
        const subGetRes = await APIRequest("/subcategory/", "GET");
        const subGetData = await subGetRes.json();
        subcategoriesDispatch({ type: "SET", data: subGetData });
        await localforage.setItem("subcategories", subGetData);
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

  return <>{renderSwitch(step)}</>;
}
