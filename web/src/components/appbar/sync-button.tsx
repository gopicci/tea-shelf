import React, {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { CircularProgress, IconButton } from "@material-ui/core";
import { CloudDone, Refresh } from "@material-ui/icons";
import localforage from "localforage";
import { getOfflineTeas, uploadOffline } from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import { makeStyles } from "@material-ui/core/styles";
import { SyncDispatch, SyncState } from "../statecontainers/sync-context";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import { TeaDispatch } from "../statecontainers/tea-context";
import { SubcategoriesDispatch } from "../statecontainers/subcategories-context";
import { VendorsDispatch } from "../statecontainers/vendors-context";

const useStyles = makeStyles((theme) => ({
  circularProgress: {
    color: theme.palette.common.white,
  },
}));

/**
 * Sync icon button component. Callback runs on mount and on click.
 * Uploads offline cached tea instances, downloads tea instances,
 * categories, subcategories, vendors from API, updating global contexts.
 *
 * @component
 * @subcategory Main
 */
function SyncButton(): ReactElement {
  const classes = useStyles();

  const [isSyncing, setSyncing] = useState(false);

  const sync = useContext(SyncState);
  const syncDispatch = useContext(SyncDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
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
      await uploadOffline();
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Get remaining offline teas
      const offlineTeas = await getOfflineTeas();

      // Download teas from API
      const res = await APIRequest("/tea/", "GET");
      const body = await res.json();

      // Update central teas state
      teaDispatch({ type: "SET", data: offlineTeas.concat(body) });

      // Update teas cache
      await localforage.setItem("teas", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download categories from API
      const res = await APIRequest("/category/", "GET");
      const body = await res.json();

      // Update central categories state
      subcategoriesDispatch({ type: "SET", data: body });

      // Update categories cache
      await localforage.setItem("categories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download subcategories from API
      const res = await APIRequest("/subcategory/", "GET");
      const body = await res.json();

      // Update central subcategories state
      subcategoriesDispatch({ type: "SET", data: body });

      // Update subcategories cache
      await localforage.setItem("subcategories", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Download vendors from API
      const res = await APIRequest("/vendor/", "GET");
      const body = await res.json();

      // Update central vendors state
      vendorDispatch({ type: "SET", data: body });

      // Update vendors cache
      await localforage.setItem("vendors", body);
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
  }, [
    snackbarDispatch,
    subcategoriesDispatch,
    syncDispatch,
    teaDispatch,
    vendorDispatch,
  ]);

  useEffect(() => {
    handleSync();
  }, [handleSync]);

  return isSyncing ? (
    <IconButton color="inherit" aria-label="refresh">
      <CircularProgress
        className={classes.circularProgress}
        size={20}
        thickness={5}
      />
    </IconButton>
  ) : (
    <IconButton color="inherit" aria-label="refresh" onClick={handleSync}>
      {sync ? <CloudDone /> : <Refresh />}
    </IconButton>
  );
}

export default SyncButton;
