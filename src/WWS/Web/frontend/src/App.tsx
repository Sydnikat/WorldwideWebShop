import React from 'react'

import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import {Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import CustomerMainPage from "./pages/CustomerMainPage";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <ChakraProvider>
      <Router>
          <Switch>
            <Route path="/" exact component={CustomerMainPage} />
            <Route path="/profile" exact component={UserProfilePage} />
          </Switch>
      </Router>
    </ChakraProvider>
  )
}

export default App
