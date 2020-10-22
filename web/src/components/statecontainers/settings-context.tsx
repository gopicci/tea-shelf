import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactElement,
  useEffect,
  useReducer,
} from "react";
import { Settings } from "../../services/models";
import localforage from "localforage";

/**
 * Settings reducer action type
 *
 * @memberOf SettingsContext
 */
type Action = {
  /** Action type */
  type: "SWITCH_VIEW" | "SWITCH_UNITS" | "SWITCH_BREWING" | "SWITCH_VIBRATION";
};

function reducer(state: Settings, action: Action): Settings {
  switch (action.type) {
    case "SWITCH_VIEW":
      return { ...state, gridView: !state.gridView };
    case "SWITCH_UNITS":
      return { ...state, metric: !state.metric };
    case "SWITCH_BREWING":
      return { ...state, gongfu: !state.gongfu };
    case "SWITCH_VIBRATION":
      return { ...state, vibration: !state.vibration };
    default:
      return state;
  }
}

const initialState: Settings = {
  gridView: true,
  metric: true,
  gongfu: true,
  vibration: true,
};

export const SettingsState = createContext<Settings>(initialState);
export const SettingsDispatch = createContext({} as Dispatch<Action>);

type Props = {
  children: ReactChild;
};

/**
 * Global settings state and dispatch provider.
 *
 * @component
 * @subcategory State containers
 */
function SettingsContext({ children }: Props): ReactElement {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    /**
     * Load settings from cache on mount.
     *
     * @memberOf SettingsContext
     */
    async function loadSettings(): Promise<void> {
      const settings = await localforage.getItem<Settings>("settings");
      if (settings) {
        if (!settings.gridView) dispatch({ type: "SWITCH_VIEW" });
        if (!settings.metric) dispatch({ type: "SWITCH_UNITS" });
        if (!settings.gongfu) dispatch({ type: "SWITCH_BREWING" });
        if (!settings.vibration) dispatch({ type: "SWITCH_VIBRATION" });
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    /**
     * Save settings to cache on change.
     *
     * @memberOf SettingsContext
     */
    async function saveSettings(): Promise<void> {
      await localforage.setItem<Settings>("settings", state);
    }
    saveSettings();
  }, [state]);

  return (
    <SettingsDispatch.Provider value={dispatch}>
      <SettingsState.Provider value={state}>{children}</SettingsState.Provider>
    </SettingsDispatch.Provider>
  );
}

export default SettingsContext;
