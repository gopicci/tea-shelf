import React, {
  createContext,
  ReactChild,
  ReactElement,
  useContext,
} from "react";
import localforage from "localforage";
import {
  generateUniqueId,
  getOfflineTeas,
  uploadInstance,
} from "../services/sync-services";
import { SnackbarDispatch } from "./statecontainers/snackbar-context";
import { TeaDispatch, TeasState } from "./statecontainers/tea-context";
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
  SubcategoryInstance,
  TeaInstance,
  TeaRequest,
  VendorModel,
} from "../services/models";

type Props = {
  children: ReactChild;
};

/**
 * handleTeaEdit function type.
 *
 * @memberOf EditTea
 */
export type HandleTeaEdit = (
  /** Request data. */
  data: TeaRequest,
  /** Optional ID for editing request. */
  offline_id?: number,
  /** Optional snackbar success message */
  message?: string
) => void;

export const TeaEditorContext = createContext({} as HandleTeaEdit);

/**
 * Provides tea instance editing to components that needs it.
 *
 * @component
 * @subcategory Main
 */
function EditTea({ children }: Props): ReactElement {
  const snackbarDispatch = useContext(SnackbarDispatch);
  const teas = useContext(TeasState);
  const teaDispatch = useContext(TeaDispatch);
  const subcategories = useContext(SubcategoriesState);
  const subcategoriesDispatch = useContext(SubcategoriesDispatch);
  const vendors = useContext(VendorsState);
  const vendorsDispatch = useContext(VendorsDispatch);
  const syncDispatch = useContext(SyncDispatch);

  /**
   * Handles tea instance edit/creation process. Updates state and saves instance locally
   * first. Then tries to sync local cache with API.
   */
  const handleTeaEdit: HandleTeaEdit = async (
    data,
    offline_id,
    message
  ): Promise<void> => {
    try {
      let offlineTeas = await getOfflineTeas();
      let id = offline_id;
      let apiId = "";

      // Update context with request
      if (id) {
        const instance = Object.values(teas).find((t) => t.offline_id === id);
        if (instance && instance.id) apiId = instance.id;
        teaDispatch({ type: "EDIT", data: { ...data, offline_id: id } });
      } else {
        id = await generateUniqueId(teas);
        teaDispatch({ type: "ADD", data: { ...data, offline_id: id } });
      }

      // If tea already present in cache remove before adding again
      for (const tea of offlineTeas)
        if (tea.offline_id === id)
          offlineTeas.splice(offlineTeas.indexOf(tea), 1);

      await localforage.setItem<TeaInstance[]>("offline-teas", [
        ...offlineTeas,
        { ...data, offline_id: id },
      ]);

      syncDispatch({ type: "SET_NOT_SYNCED" });

      // New subcategory, update context and cache
      if (
        data.subcategory &&
        !Object.values(subcategories).some(
          (s) => s.name === data.subcategory?.name
        )
      ) {
        const subcategory = {
          ...data.subcategory,
          offline_id: await generateUniqueId(subcategories),
        };
        subcategoriesDispatch({
          type: "SET",
          data: subcategories.concat(subcategory),
        });
        await localforage.setItem<SubcategoryInstance[]>(
          "subcategories",
          subcategories.concat(subcategory)
        );
      }

      // New vendor, update context and cache
      if (
        data.vendor &&
        !Object.values(vendors).some((v) => v.name === data.vendor?.name)
      ) {
        const vendor = {
          ...data.vendor,
          offline_id: await generateUniqueId(vendors),
        };
        vendorsDispatch({ type: "SET", data: vendors.concat(vendor) });
        await localforage.setItem<VendorModel[]>(
          "vendors",
          vendors.concat(vendor)
        );
      }

      // Upload through API
      const response = await uploadInstance(data, apiId);
      const body = await response.json();

      // Update global state
      teaDispatch({ type: "EDIT", data: { ...body, offline_id: id } });

      // Delete offline entry
      for (const tea of offlineTeas)
        if (tea.offline_id === id)
          offlineTeas.splice(offlineTeas.indexOf(tea), 1);
      await localforage.setItem<TeaInstance[]>("offline-teas", offlineTeas);

      // Update sync status
      syncDispatch({ type: "SET_SYNCED" });

      // Notify on success
      if (message)
        snackbarDispatch({
          type: "SUCCESS",
          data: message,
        });
    } catch (e) {
      if (e.message === "Bad Request")
        snackbarDispatch({ type: "ERROR", data: "Error: " + e.message });
      else
        snackbarDispatch({
          type: "WARNING",
          data: "Tea saved locally.",
        });
    }
  };

  return (
    <TeaEditorContext.Provider value={handleTeaEdit}>
      {children}
    </TeaEditorContext.Provider>
  );
}

export default EditTea;
