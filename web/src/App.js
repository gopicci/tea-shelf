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

  const [route, setRoute] = useState('CREATE');

  function getRoute(route) {
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
      {getRoute(route)}
    </ThemeProvider>
  );
}

export default App;
