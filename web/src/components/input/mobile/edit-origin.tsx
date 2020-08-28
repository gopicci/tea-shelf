import React, { ReactElement, useEffect, useState } from "react";
import { APIRequest } from "../../../services/auth-services";
import EditOriginOnline from "./edit-origin-online";
import EditOriginOffline from "./edit-origin-offline";
import { InputProps } from "./mobile-input";

/**
 * EditOrigin props.
 *
 * @memberOf EditOrigin
 */
type Props = {
  props: InputProps;
};

/**
 * Mobile tea creation origin input router component. If API is unreachable
 * return offline component, otherwise online.
 *
 * @component
 * @subcategory Mobile input
 */
function EditOrigin(props: Props): ReactElement {
  const [isOnline, setOnline] = useState(true);

  /** Checks if the API is reachable and updates state */
  async function checkOnline(): Promise<void> {
    try {
      const res = await APIRequest("/user/", "GET", undefined, 1000);
      if (res.ok) setOnline(true);
      else setOnline(false);
    } catch (e) {
      setOnline(false);
    }
  }

  useEffect(() => {
    checkOnline();
  }, []);

  return (
    <>
      {isOnline ? (
        <EditOriginOnline {...props.props} />
      ) : (
        <EditOriginOffline {...props.props} />
      )}
    </>
  );
}

export default EditOrigin;
