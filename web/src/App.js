import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import localforage from 'localforage';

import Register from './components/Register';
import Login from './components/Login';

import PageLayout from './components/PageLayout';
import Create from './components/Create';

import { APIRequest, getUser } from './services/AuthService';

import { mainTheme } from './style/MainTheme';
import './App.css';
import CategoriesStateContainer from './components/containers/CategoriesStateContainer';
import {Box} from '@material-ui/core';



function App() {
  const [isLoggedIn, setLoggedIn] = useState(() => {
    return window.localStorage.getItem('user.auth') !== null;
  });



  const logout = () => {
    window.localStorage.removeItem('user.auth');
    setLoggedIn(false);
  };

  // APIRequest('/category/', 'GET').then(res => console.log(res))

  // console.log(getUser())

  const [route, setRoute] = useState('MAIN');

  function getRoute(route) {
    if (!isLoggedIn)
      return <Login />

    switch (route) {
      case "MAIN":
        return <PageLayout setRoute={setRoute} />
      case "CREATE":
        return <Create  setRoute={setRoute} />
      default:
        return <PageLayout  setRoute={setRoute} />
    }
  }

  return (
    <ThemeProvider theme={mainTheme}>
      <CategoriesStateContainer>
        {getRoute(route)}
      </CategoriesStateContainer>
    </ThemeProvider>
  );
}

export default App;
