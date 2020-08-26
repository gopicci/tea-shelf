import React, { useState, ReactElement } from "react";
import { ThemeProvider } from "@material-ui/styles";

//import Register from "./components/Register";
import Login from "./components/login";
import MainLayout from "./components/main-layout";
import SortFilter from './components/sort-filter';
import Create from './components/create';
import CustomSnackbar from "./components/snackbar/custom-snackbar";
import MainStateContainer from "./components/statecontainers/main-state-container";
import { getUser } from "./services/auth-services";
import { mainTheme as theme, mainTheme } from "./style/MainTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * Defines type for app's main routing state.
 *
 * @memberOf App
 * @alias Route
 */
export type Route = {
  /** Route name */
  route: "MAIN" | "FILTER" | "CREATE" | "EDIT" | "EDIT_NOTES" | "TEA_DETAILS";
  /** Optional route payload */
  payload?: object;
};

/**
 * Main app component. Checks if user is logged in and divert to selected route.
 * Routes are wrapped in central state provider.
 *
 * @component
 * @subcategory Main
 */
function App(): ReactElement {
  const isLoggedIn = getUser();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [route, setRoute] = useState<Route>({ route: "MAIN" });

  /**
   * Returns React component based on route name, passing optional route payload.
   *
   * @param {Route} route Route info
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
        return <MainLayout {...props} />;
      case "FILTER":
        return <SortFilter {...props} />;
      case "CREATE":
        if (isMobile) return <Create {...props} />;
        else return <MainLayout {...props} />;
      default:
        return <MainLayout {...props} />;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {!isLoggedIn ? (
        <Login />
      ) : (
        <MainStateContainer>
          <>
            {getRoute(route)}
            <CustomSnackbar />
          </>
        </MainStateContainer>
      )}
    </ThemeProvider>
  );
}

export default App;
