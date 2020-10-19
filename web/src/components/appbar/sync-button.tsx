import React, { ReactElement, useCallback, useContext, useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { CloudDone, Refresh } from "@material-ui/icons";
import localforage from "localforage";
import { uploadOffline, syncInstances } from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import { SyncDispatch, SyncState } from "../statecontainers/sync-context";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import { TeaDispatch } from "../statecontainers/tea-context";
import { SubcategoriesDispatch } from "../statecontainers/subcategories-context";
import { VendorsDispatch } from "../statecontainers/vendors-context";
import { SessionDispatch } from "../statecontainers/session-context";
import { Route } from "../../app";

/**
 * SyncButton props.
 *
 * @memberOf SyncButton
 */
type Props = {
  /** App's main route state */
  route: Route;
  /** Set app's main route */
  setRoute: (route: Route) => void;
};

/**
 * Sync icon button component. Callback runs on mount and on click.
 * Uploads offline cached tea instances, downloads tea instances,
 * categories, subcategories, vendors from API, updating global contexts.
 *
 * @component
 * @subcategory Main
 */
function SyncButton({ route, setRoute }: Props): ReactElement {
  const [isSyncing, setSyncing] = useState(false);

  const sync = useContext(SyncState);
  const syncDispatch = useContext(SyncDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const sessionDispatch = useContext(SessionDispatch);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendorDispatch = useContext(VendorsDispatch);

  /**
   * Syncs global states and local caches with API.
   */
  const handleSync: () => Promise<void> = useCallback(async () => {
    setSyncing(true);
    let error = null;

    try {
      // Try to upload offline tea entries
      await uploadOffline("tea");
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Try to upload offline brewing sessions entries
      await uploadOffline("session");
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Update tea instances
      await syncInstances("tea", teaDispatch);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Update session instances
      await syncInstances("session", sessionDispatch);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download categories from API
      const res = await APIRequest("/category/", "GET");
      const body = await res.json();

      // Update global categories state
      subcategoriesDispatch({ type: "SET", data: body });

      // Update categories cache
      await localforage.setItem("categories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Update subcategory instances
      await syncInstances("subcategory", subcategoriesDispatch);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Update vendor instances
      await syncInstances("vendor", vendorDispatch);
    } catch (e) {
      console.error(e);
      error = e;
    }
    setSyncing(false);

    // Update global sync context
    if (error) {
      syncDispatch({ type: "SET_NOT_SYNCED" });
      snackbarDispatch({ type: "ERROR", data: error.message });
    } else {
      syncDispatch({ type: "SET_SYNCED" });
    }

    // Get out of instance details routes
    if (["TEA_DETAILS", "EDIT_TEA", "EDIT_NOTES"].includes(route.route))
      setRoute({ route: "MAIN" });
    if (route.route === "SESSION_DETAILS") setRoute({ route: "SESSIONS" });
  }, [
    route.route,
    sessionDispatch,
    setRoute,
    snackbarDispatch,
    subcategoriesDispatch,
    syncDispatch,
    teaDispatch,
    vendorDispatch,
  ]);

  return isSyncing ? (
    <IconButton aria-label="refresh">
      <CircularProgress size={20} thickness={5} />
    </IconButton>
  ) : (
    <Tooltip title="Refresh">
      <IconButton aria-label="refresh" onClick={handleSync}>
        {sync ? <CloudDone /> : <Refresh />}
      </IconButton>
    </Tooltip>
  );
}

export default SyncButton;
