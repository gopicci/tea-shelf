import React, { useContext, useState } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import InputRouter from "./input/mobile/InputRouter";
import TeaDetails from './TeaDetails';
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

export default function Edit({ setRoute, editData, notes=false, details=false }) {
  /**
   * Mobile tea entry edit process.
   *
   * teaData tracks the input state.
   *
   * @param editData {json} Initial input tea data
   * @param setRoute {function} Set main route
   * @param notes {bool} Editing notes
   * @param details {bool} View tea details
   */

  const classes = useStyles();

  const [teaData, setTeaData] = useState(editData);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  async function handleEdit(data=null) {
    let reqData = { ...teaData };
    if (data) reqData = {...data};

    let image = null;
    let customSubcategory = false;
    let customVendor = false;

    try {
      image = reqData.image;
      delete reqData.image;

      if (reqData.subcategory) {
        if (!reqData.subcategory.category) customSubcategory = true;
        reqData.subcategory = {
          name: reqData.subcategory.name,
          category: reqData.category,
        };
      }

      if (reqData.vendor) if (!reqData.vendor.popularity) customVendor = true;

      if (reqData.year === "unknown") reqData.year = null;

      console.log(reqData);
      console.log(JSON.stringify(reqData));
      const res = await APIRequest(
        `/tea/${reqData.id}/`,
        "PUT",
        JSON.stringify(reqData)
      );
      console.log("Tea updated: ", res);
      const body = await res.json();
      console.log(body);

      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully updated" });

      // Update tea context with newly added
      teaDispatch({ type: "EDIT", data: body });

      setTeaData(body);

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

      setRoute({route: "TEA_DETAILS", data: body})

    } catch (e) {
      console.error(e);
      if (e.message === "Bad Request") {
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      } else {
        console.log(e.message, "cache locally");
        if (image) reqData["image"] = image;
        const offlineTeas = await localforage.getItem("offline-teas");
        const cache = await localforage.setItem("offline-teas", [
          ...offlineTeas,
          reqData,
        ]);
        snackbarDispatch({
          type: "WARNING",
          data: "Offline mode, tea saved locally",
        });
        teaDispatch({ type: "ADD", data: teaData });
        console.log("offline teas:", cache);

        setRoute({route: "TEA_DETAILS", data: reqData})
      }
    }
  }

  function handlePrevious() {
    setRoute({ route: "TEA_DETAILS", data: teaData });
  }

  const props = {
    teaData,
    setTeaData,
    handlePrevious,
    handleEdit,
    notes,
  }

  return (
    <Box className={classes.root}>
      {details ?  <TeaDetails {...props} setRoute={setRoute} /> : <InputRouter {...props} />}
    </Box>
  );
}
