import React, {
  createContext,
  ReactChild,
  ReactElement,
  useContext,
} from "react";
import localforage from "localforage";
import validator from "validator";
import {
  generateUniqueId,
  getOfflineTeas,
  uploadInstance,
} from "../services/sync-services";
import { SnackbarDispatch } from "./statecontainers/snackbar-context";
import { TeaDispatch } from "./statecontainers/tea-context";
import {
  SubcategoriesDispatch,
  SubcategoriesState,
} from "./statecontainers/subcategories-context";
import {
  VendorsDispatch,
  VendorsState,
} from "./statecontainers/vendors-context";
import { SyncDispatch } from "./statecontainers/sync-context";
import {
  SubcategoryModel,
  TeaInstance,
  TeaRequest,
  VendorModel,
} from "../services/models";

type Props = {
  children: ReactChild;
};

export type HandleEdit = (data: TeaRequest, id?: number | string) => void;

export const EditorContext = createContext({} as HandleEdit);

/**
 * Provides tea instance editing to components that needs it.
 *
 * @component
 * @subcategory Main
 */
function Editor({ children }: Props): ReactElement {
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teaDispatch = useContext(TeaDispatch);
  const subcategories = useContext(SubcategoriesState);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendors = useContext(VendorsState);
  const vendorsDispatch = useContext(VendorsDispatch);
  const syncDispatch = useContext(SyncDispatch);

  /**
   * Handles tea instance edit/creation process. Updates state and saves instance locally
   * first. Then tries to sync local cache with API.
   *
   * @param {TeaRequest} teaData - Request data
   * @param {string|number} [id] - Instance ID for editing purposes
   */
  async function handleEdit(teaData: TeaRequest, id?: string | number) {
    try {
      let offlineTeas = await getOfflineTeas();

      // Update context with request
      if (id) teaDispatch({ type: "EDIT", data: { ...teaData, id: id } });
      else {
        id = generateUniqueId(offlineTeas);
        teaDispatch({ type: "ADD", data: { ...teaData, id: id } });
      }
      console.log("id", id);
      // If tea already present in cache remove before adding again
      for (const tea of offlineTeas)
        if (tea.id === id) offlineTeas.splice(offlineTeas.indexOf(tea), 1);

      await localforage.setItem<TeaInstance[]>("offline-teas", [
        ...offlineTeas,
        { ...teaData, id: id },
      ]);

      syncDispatch({ type: "SET_NOT_SYNCED" });

      // New subcategory, update context and cache
      if (teaData.subcategory && !subcategories.includes(teaData.subcategory)) {
        const subcategory = {
          ...teaData.subcategory,
          id: generateUniqueId(subcategories),
        };
        subcategoriesDispatch({
          type: "SET",
          data: subcategories.concat(subcategory),
        });
        await localforage.setItem<SubcategoryModel[]>(
          "subcategories",
          subcategories.concat(subcategory)
        );
      }

      // New vendor, update context and cache
      if (teaData.vendor && !vendors.includes(teaData.vendor)) {
        const vendor = { ...teaData.vendor, id: generateUniqueId(vendors) };
        vendorsDispatch({ type: "SET", data: vendors.concat(vendor) });
        await localforage.setItem<VendorModel[]>(
          "vendors",
          vendors.concat(vendor)
        );
      }

      // Upload through API
      const response = await uploadInstance({ ...teaData, id });
      const body = await response.json();

      // Update context
      teaDispatch({ type: "DELETE", data: { ...teaData, id } });
      teaDispatch({ type: "ADD", data: { ...teaData, id: body.id } });

      // Delete offline entry
      for (const tea of offlineTeas)
        if (tea.id === id) offlineTeas.splice(offlineTeas.indexOf(tea), 1);
      await localforage.setItem<TeaInstance[]>("offline-teas", offlineTeas);

      // Update sync status
      syncDispatch({ type: "SET_SYNCED" });

      // Notify on successful creation
      if (typeof id === "string" && validator.isUUID(id))
        snackbarDispatch({
          type: "SUCCESS",
          data: "Tea successfully created.",
        });
    } catch (e) {
      if (e.message === "Bad Request")
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      else
        snackbarDispatch({
          type: "WARNING",
          data: "Network error, tea saved locally.",
        });
    }
  }

  return (
    <EditorContext.Provider value={handleEdit}>
      {children}
    </EditorContext.Provider>
  );
}

export default Editor;
