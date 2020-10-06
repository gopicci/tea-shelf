import React, { ReactElement, useContext, useState } from "react";
import LoadImage from "./input/desktop/load-image";
import InputForm from "./input/desktop/input-form";
import { Route } from "../app";
import { TeaModel } from "../services/models";
import { EditorContext, HandleTeaEdit } from "./edit-tea";
import MobileInput from "./input/mobile/mobile-input";
import CaptureImage from "./input/mobile/capture-image";

/**
 * DesktopCreate props.
 *
 * @memberOf Create
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
 * Tea instance creation component. Revolves around 2 stages: image
 * capturing/loading and form data input. Routes between them keeping
 * relevant state.
 *
 * @component
 * @subcategory Main
 */
function Create({ route, setRoute, isMobile }: Props): ReactElement {
  const [imageLoadDone, setImageLoadDone] = useState(false);
  const [imageData, setImageData] = useState("");
  const [visionData, setVisionData] = useState({} as TeaModel);

  const handleTeaEdit: HandleTeaEdit = useContext(EditorContext);

  /** Routes to main. */
  function handleClose(): void {
    setRoute({ route: "MAIN" });
  }

  const captureProps = {
    imageData,
    setImageData,
    setVisionData,
    setImageLoadDone,
    handleClose,
  };
  const inputProps = {
    route,
    setRoute,
    handleTeaEdit,
    imageData,
    visionData,
    setImageLoadDone,
  };

  if (imageLoadDone) {
    if (isMobile) return <MobileInput {...inputProps} />;
    else return <InputForm {...inputProps} />;
  } else {
    if (isMobile) return <CaptureImage {...captureProps} />;
    else return <LoadImage {...captureProps} />;
  }
}

export default Create;
