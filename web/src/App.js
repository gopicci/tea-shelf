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
import { mainTheme } from "./style/MainTheme";
import "./App.css";

/**
 * Main app component. Checks if user is logged in and sets up main routes.
 * Routes are wrapped in central state provider.
 */
function App() {
  const isLoggedIn = getUser();

  const [route, setRoute] = useState({ route: "MAIN", data: null });

  function getRoute(route) {
    switch (route.route) {
      case "MAIN":
        return <MainPageLayout setRoute={setRoute} />;
      case "FILTER":
        return <SortFilter setRoute={setRoute} />;
      case "CREATE":
        return <Create setRoute={setRoute} />;
      case "EDIT":
        return <Edit setRoute={setRoute} initialState={route.data} />;
      case "EDIT_NOTES":
        return (
          <Edit setRoute={setRoute} initialState={route.data} notes={true} />
        );
      case "TEA_DETAILS":
        return (
          <Edit setRoute={setRoute} initialState={route.data} details={true} />
        );
      default:
        return <MainPageLayout setRoute={setRoute} />;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {!isLoggedIn ? (
        <Login />
      ) : (
        <MainStateContainer>
          {getRoute(route)}
          <CustomSnackbar />
        </MainStateContainer>
      )}
    </ThemeProvider>
  );
}

export default App;
