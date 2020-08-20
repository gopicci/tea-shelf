import React, { useState } from "react";
import { ThemeProvider } from "@material-ui/styles";

//import Register from "./components/Register";
import Login from "./components/Login";
import MainPageLayout from "./components/MainPageLayout";
import Create from "./components/Create";
import Edit from "./components/Edit";
import SortFilter from "./components/SortFilter";
import CustomSnackbar from "./components/snackbar/CustomSnackbar";
import MainStateContainer from "./components/statecontainers/MainStateContainer";
import { getUser } from "./services/AuthService";
import { mainTheme as theme, mainTheme } from "./style/MainTheme";
import "./App.css";
import useMediaQuery from "@material-ui/core/useMediaQuery";

/**
 * Main app component. Checks if user is logged in and sets up main routes.
 * Routes are wrapped in central state provider.
 */
function App() {
  const isLoggedIn = getUser();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [router, setRouter] = useState({ route: "MAIN", data: null });

  function getRoute(router) {
    const props = {
      router,
      setRouter,
      isMobile,
    };

    switch (router.route) {
      case "MAIN":
        return <MainPageLayout {...props} />;
      case "FILTER":
        return <SortFilter {...props} />;
      case "CREATE":
        if (isMobile) return <Create {...props} />;
        else return <MainPageLayout {...props} />;
      case "EDIT":
        if (isMobile) return <Edit {...props} />;
        else return <MainPageLayout {...props} />;
      case "EDIT_NOTES":
        return <Edit {...props} />;
      case "TEA_DETAILS":
        if (isMobile) return <Edit {...props} />;
        else return <MainPageLayout {...props} />;
      default:
        return <MainPageLayout {...props} />;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {!isLoggedIn ? (
        <Login />
      ) : (
        <MainStateContainer>
          {getRoute(router)}
          <CustomSnackbar />
        </MainStateContainer>
      )}
    </ThemeProvider>
  );
}

export default App;
