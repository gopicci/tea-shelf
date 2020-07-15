import React, {useContext, useState} from 'react';
import { ThemeProvider } from '@material-ui/styles';

import Register from './components/Register';
import Login from './components/Login';

import PageLayout from './components/PageLayout';
import Create from './components/Create';

import { mainTheme } from './style/MainTheme';
import './App.css';

import {LoggedInState} from './components/containers/LoggedInStateContainer';
import MainStateContainer from './components/containers/MainStateContainer';


function App() {

  const isLoggedIn = useContext(LoggedInState);

  // APIRequest('/subcategory/', 'GET').then(res => console.log(res))

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
      <MainStateContainer>
        {getRoute(route)}
      </MainStateContainer>
    </ThemeProvider>
  );
}

export default App;
