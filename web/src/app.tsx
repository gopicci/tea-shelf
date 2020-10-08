import React, { useState, ReactElement } from "react";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import PasswordRequest from "./components/auth/password-request";
import PasswordReset from "./components/auth/password-reset";
import MainLayout from "./components/main-layout";
import SortFilter from "./components/filters/sort-filter";
import EditTea from "./components/edit-tea";
import EditSession from "./components/edit-session";
import CustomSnackbar from "./components/snackbar/custom-snackbar";
import MainStateContainer from "./components/statecontainers/main-state-container";
import CreateTea from "./components/create-tea";
import MobileDetailsLayout from "./components/details/mobile/mobile-details-layout";
import MobileInput from "./components/input/mobile/mobile-input";
import Settings from "./components/settings";
import { getUser } from "./services/auth-services";
import { mainTheme as theme, mainTheme } from "./style/main-theme";
import { Confirmation, SessionInstance, TeaInstance } from "./services/models";
import SessionLayout from "./components/session/session-layout";

/**
 * Defines type for app's main routing state.
 *
 * @memberOf App
 * @alias Route
 */
export type Route = {
  /** Route name */
  route:
    | "MAIN"
    | "FILTER"
    | "CREATE_TEA"
    | "EDIT_TEA"
    | "EDIT_NOTES"
    | "TEA_DETAILS"
    | "ARCHIVE"
    | "SETTINGS"
    | "REGISTER"
    | "PASSWORD_REQUEST"
    | "CONFIRMATION"
    | "SESSIONS"
    | "CREATE_SESSION"
    | "SESSION_DETAILS";
  /** Optional route tea data payload */
  teaPayload?: TeaInstance;
  /** Optional route brewing session data payload */
  sessionPayload?: SessionInstance;
  /** Optional route confirmation */
  confirmation?: Confirmation;
};

/**
 * Base app component. Checks if user is logged in and diverts to selected route.
 * Routes are wrapped in global state provider.
 *
 * @component
 * @subcategory Main
 */
function App(): ReactElement {
  const isLoggedIn = getUser();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [route, setRoute] = useState<Route>({ route: "MAIN" });

  /**
   * Returns component based on route name, passing optional route payload
   * or callback.
   *
   * @param {Route} route - Route data
   * @returns {ReactElement}
   */
  function getRoute(route: Route): ReactElement {
    const props = {
      route,
      setRoute,
      isMobile,
    };

    switch (route.route) {
      case "MAIN":
      case "ARCHIVE":
      case "SESSIONS":
      case "CONFIRMATION":
        return <MainLayout {...props} />;
      case "FILTER":
        return <SortFilter {...props} />;
      case "CREATE_TEA":
        if (isMobile) return <CreateTea {...props} />;
        else return <MainLayout {...props} />;
      case "EDIT_TEA":
        if (isMobile) return <MobileInput {...props} />;
        else return <MainLayout {...props} />;
      case "EDIT_NOTES":
        if (isMobile) return <MobileDetailsLayout {...props} />;
        else return <MainLayout {...props} />;
      case "TEA_DETAILS":
        if (isMobile) return <MobileDetailsLayout {...props} />;
        else return <MainLayout {...props} />;
      case "CREATE_SESSION":
        return <MainLayout {...props} />;
      case "SESSION_DETAILS":
        if (isMobile) return <SessionLayout {...props} />;
        else return <MainLayout {...props} />;
      case "SETTINGS":
        if (isMobile) return <Settings {...props} />;
        else return <MainLayout {...props} />;
      default:
        return <MainLayout {...props} />;
    }
  }

  /**
   * Returns authentication related component based on route name.
   *
   * @param {Route} route - Route data
   * @returns {ReactElement}
   */
  function getAuthRoute(route: Route): ReactElement {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset_token");

    switch (route.route) {
      case "REGISTER":
        return <Register setRoute={setRoute} />;
      case "PASSWORD_REQUEST":
        return <PasswordRequest setRoute={setRoute} />;
      default:
        if (token) return <PasswordReset setRoute={setRoute} token={token} />;
        else return <Login setRoute={setRoute} />;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline />
      {!isLoggedIn ? (
        getAuthRoute(route)
      ) : (
        <MainStateContainer>
          <>
            <EditTea>
              <EditSession>{getRoute(route)}</EditSession>
            </EditTea>
            <CustomSnackbar />
          </>
        </MainStateContainer>
      )}
    </ThemeProvider>
  );
}

export default App;
