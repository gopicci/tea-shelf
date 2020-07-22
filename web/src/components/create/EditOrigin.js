import React, { useEffect, useState } from "react";
import { APIRequest } from "../../services/AuthService";

import EditOriginOnline from "./EditOriginOnline";
import EditOriginOffline from "./EditOriginOffline";

export default function EditOrigin(props) {
  const [isOnline, setOnline] = useState(true);

  async function checkOnline() {
    try {
      const res = await APIRequest("/user/", "GET", null, 1000);
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
        <EditOriginOnline {...props} />
      ) : (
        <EditOriginOffline {...props} />
      )}
    </>
  );
}
