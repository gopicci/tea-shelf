import React, { ReactElement, useCallback, useContext, useState } from "react";
import { CircularProgress, IconButton, Tooltip } from "@material-ui/core";
import { CloudDone, Refresh } from "@material-ui/icons";
import localforage from "localforage";
import {
  getOfflineTeas,
  getOfflineSessions,
  uploadOfflineTeas,
  uploadOfflineSessions,
} from "../../services/sync-services";
import { APIRequest } from "../../services/auth-services";
import { SyncDispatch, SyncState } from "../statecontainers/sync-context";
import { SnackbarDispatch } from "../statecontainers/snackbar-context";
import { TeaDispatch } from "../statecontainers/tea-context";
import { SubcategoriesDispatch } from "../statecontainers/subcategories-context";
import { VendorsDispatch } from "../statecontainers/vendors-context";
import { SessionDispatch } from "../statecontainers/session-context";
import { ClockDispatch } from "../statecontainers/clock-context";
import { Clock } from "../../services/models";

/**
 * Sync icon button component. Callback runs on mount and on click.
 * Uploads offline cached tea instances, downloads tea instances,
 * categories, subcategories, vendors from API, updating global contexts.
 *
 * @component
 * @subcategory Main
 */
function SyncButton(): ReactElement {
  const [isSyncing, setSyncing] = useState(false);

  const sync = useContext(SyncState);
  const syncDispatch = useContext(SyncDispatch);
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const sessionDispatch = useContext(SessionDispatch);
  const clockDispatch = useContext(ClockDispatch);
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
      await uploadOfflineTeas();
      // Try to upload offline brewing sessions entries
      await uploadOfflineSessions();
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

      // Update global teas state
      teaDispatch({ type: "SET", data: offlineTeas.concat(body) });

      // Update teas cache
      await localforage.setItem("teas", body);
    } catch (e) {
      console.error(e);
      error = e;
    }

    try {
      // Get remaining offline sessions
      const offlineSessions = await getOfflineSessions();

      // Download sessions from API
      const res = await APIRequest("/brewing_session/", "GET");
      const onlineSessions = await res.json();

      const sessions = offlineSessions.concat(onlineSessions);

      // Update global teas state
      sessionDispatch({ type: "SET", data: sessions });

      // Update teas cache
      await localforage.setItem("sessions", onlineSessions);

      // Remove clocks that don't have a matching session ID
      const cachedClocks = await localforage.getItem<Clock[]>("clocks");
      const filteredClocks = cachedClocks.filter((c) =>
        sessions.some((s) => s.id === c.id)
      );
      clockDispatch({ type: "SET", data: filteredClocks });
      await localforage.setItem<Clock[]>("clocks", filteredClocks);
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
      // Download subcategories from API
      const res = await APIRequest("/subcategory/", "GET");
      const body = await res.json();

      // Update global subcategories state
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

      // Update global vendors state
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
    sessionDispatch,
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
