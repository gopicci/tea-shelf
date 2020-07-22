import React, { useContext, useState } from "react";
import localforage from "localforage";

import CaptureImage from "./create/CaptureImage";
import InputRouter from "./create/InputRouter";
import { APIRequest } from "../services/AuthService";
import { ImageDataToFile } from "../services/ImageService";

import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";

export default function Create({ setRoute }) {
  const [imageData, setImageData] = useState(null);

  const [teaData, setTeaData] = useState({
    image: null,
    name: "",
    category: null,
    subcategory: null,
    origin: null,
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
    vendor: null,
  });

  const snackbarDispatch = useContext(SnackbarDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);

  async function handleCreate() {
    // save local, then sync
    // !subcategory.is_public ? add

    let formData = new FormData();
    let customSubcategory = false;
    let customVendor = false;

    try {
      if (imageData) teaData["image"] = imageData;

      if (teaData.subcategory)
        teaData.subcategory = {
          name: teaData.subcategory.name,
          category: teaData.category,
        };

      console.log(teaData);
      console.log(JSON.stringify(teaData));
      const res = await APIRequest("/tea/", "POST", JSON.stringify(teaData));
      console.log("Tea created: ", res);
      console.log(await res.json());

      if (customSubcategory) {
        const subGetRes = await APIRequest("/subcategory/", "GET");
        const subGetData = await subGetRes.json();
        subcategoriesDispatch({ type: "SET", data: subGetData });
        await localforage.setItem("subcategories", subGetData);
      }
    } catch (e) {
      console.error(e);
      if (e.message === "Bad Request") {
        snackbarDispatch({ type: "ERROR", data: e.message });
      } else {
        console.log(e.message, "cache locally");
        const offlineTeas = await localforage.getItem("offline-teas");
        const cache = await localforage.setItem("offline-teas", [
          ...offlineTeas,
          teaData,
        ]);
        console.log("offline teas:", cache);
      }
    }
  }

  const [step, setStep] = useState(1);

  const handleNext = () => setStep(step + 1);

  const handlePrevious = () => setStep(step - 1);

  const handleClose = () => {
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
