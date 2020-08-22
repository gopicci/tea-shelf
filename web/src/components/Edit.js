import React, { useContext, useState } from "react";
import localforage from "localforage";
import InputRouter from "./input/mobile/InputRouter";
import DetailsLayoutMobile from "./details/mobile/DetailsLayout";
import DetailsLayoutDesktop from './details/desktop/DetailsLayout';
import InputForm from './input/desktop/InputForm';
import { APIRequest } from "../services/AuthService";
import { SnackbarDispatch } from "./statecontainers/SnackbarContext";
import { TeaDispatch } from "./statecontainers/TeasContext";
import { SubcategoriesDispatch } from "./statecontainers/SubcategoriesContext";
import { VendorsDispatch } from "./statecontainers/VendorsContext";
import { teaSerializer } from "../services/Serializers";

/**
 * Handles tea editing process and routes to component that
 * have editing capabilities.
 *
 * @param router {Object} Route info in {route: string, data: json} format
 * @param setRouter {setRouter} Callback to set main route
 * @param isMobile {boolean} Mobile mode or desktop
 */
export default function Edit({ router, setRouter, isMobile = true }) {
  const [teaData, setTeaData] = useState(router.data);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorsDispatch = useContext(VendorsDispatch);

  async function handleEdit(data = null) {
    let reqData = { ...teaData };
    if (data) reqData = { ...data };

    let image = null;
    let customSubcategory = false;
    let customVendor = false;

    try {
      if (reqData.subcategory)
        if (!reqData.subcategory.category) customSubcategory = true;

      if (reqData.vendor) if (!reqData.vendor.popularity) customVendor = true;

      reqData = teaSerializer(reqData);

      // Update context with request
      teaDispatch({ type: "EDIT", data: reqData });
      setTeaData({ ...reqData });

      image = reqData.image;
      delete reqData.image;
      console.log("r", reqData);
      let res;

      if (String(reqData.id).length > 5)
        // Editing online tea
        res = await APIRequest(
          `/tea/${reqData.id}/`,
          "PUT",
          JSON.stringify(reqData)
        );
      else {
        // Editing offline tea
        delete reqData.id;
        res = await APIRequest(`/tea/`, "POST", JSON.stringify(reqData));
      }

      const body = await res.json();
      console.log(body);

      snackbarDispatch({ type: "SUCCESS", data: "Tea successfully updated" });

      // Update context with response
      teaDispatch({ type: "EDIT", data: body });
      setTeaData({ ...body });

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
        // Revert context to initial state
        teaDispatch({ type: "EDIT", data: router.data });
        setTeaData(router.data);
      } else {
        console.log(e.message, "cache locally");

        let offlineTeas = await localforage.getItem("offline-teas");
        if (!offlineTeas) await localforage.setItem("offline-teas", []);

        if (image) reqData["image"] = image;
        if (!reqData.id) reqData["id"] = router.data["id"];

        // Update context with request
        teaDispatch({ type: "EDIT", data: reqData });
        setTeaData({ ...reqData });

        // If tea already present in cache remove before adding again
        for (const tea of offlineTeas)
          if (tea.id === router.data.id)
            offlineTeas.splice(offlineTeas.indexOf(tea), 1);

        const cache = await localforage.setItem("offline-teas", [
          ...offlineTeas,
          reqData,
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
   * Returns to tea details route.
   *
   * @callback handlePrevious
   */
  function handlePrevious() {
    setRouter({ route: "TEA_DETAILS", data: teaData });
  }

  const props = {
    router,
    setRouter,
    teaData,
    setTeaData,
    handlePrevious,
    handleEdit,
  };

  function renderSwitch() {
    switch (router.route) {
      case "TEA_DETAILS":
        if (isMobile) return <DetailsLayoutMobile {...props} />;
        else return <DetailsLayoutDesktop {...props} />;
      case "EDIT":
        if (isMobile) return <InputRouter {...props} />;
        else return <InputForm {...props} />;
      default:
        return router.route;
    }
  }

  return renderSwitch();
}
