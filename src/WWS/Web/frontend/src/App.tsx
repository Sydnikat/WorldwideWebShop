import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './App.css'
import { ChakraProvider } from '@chakra-ui/react'
import {Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import CustomerMainPage from "./pages/CustomerMainPage";
import UserProfilePage from "./pages/UserProfilePage";
import {loginRoute, registerRoute, homeRoute, profileRoute } from './constants/routeConstants';
import LoginRedirect from "./components/routing/LoginRedirect";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PrivateRoute from "./components/routing/PrivateRoute";
import {CUSTOMER} from "./constants/roleConstants";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Router>
            <Switch>
              <Route path='/' exact component={LoginRedirect} />
              <Route path={loginRoute} exact component={Login} />
              <Route path={registerRoute} exact component={Registration} />
              <PrivateRoute path={homeRoute} exact roles={[CUSTOMER]} component={CustomerMainPage} />
              <PrivateRoute path={profileRoute} exact roles={[CUSTOMER]} component={UserProfilePage} />
            </Switch>
        </Router>
      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
