import React, { useState } from 'react';
import { ThemeProvider } from '@material-ui/styles';
import localforage from 'localforage';
import Map from './components/Map'

import Register from './components/Register';
import Login from './components/Login';

import PageLayout from './components/PageLayout';

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

  APIRequest('/category/', 'GET').then(res => console.log(res))

  console.log(getUser())

  return (
    <ThemeProvider theme={mainTheme}>
      <PageLayout />
    </ThemeProvider>
  );
}

export default App;
