import React, { useContext, useState } from "react";
import { ThemeProvider } from "@material-ui/styles";

import Register from "./components/Register";
import Login from "./components/Login";

import PageLayout from "./components/PageLayout";
import Create from "./components/Create";
import FilterLayoutMobile from './components/filters/FilterLayoutMobile';

import { mainTheme } from "./style/MainTheme";
import "./App.css";

import MainStateContainer from "./components/statecontainers/MainStateContainer";
import {getUser} from './services/AuthService';

function App() {
  const isLoggedIn = getUser();

  // APIRequest('/subcategory/', 'GET').then(res => console.log(res))

  // console.log(getUser())

  const [route, setRoute] = useState("MAIN");

  function getRoute(route) {
    switch (route) {
      case "MAIN":
        return <PageLayout setRoute={setRoute} />;
      case "FILTER":
        return <FilterLayoutMobile setRoute={setRoute} />;
      case "CREATE":
        return <Create setRoute={setRoute} />;
      default:
        return <PageLayout setRoute={setRoute} />;
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      {!isLoggedIn ? (
        <Login />
      ) : (
        <MainStateContainer>{getRoute(route)}</MainStateContainer>
      )}
    </ThemeProvider>
  );
}

export default App;
