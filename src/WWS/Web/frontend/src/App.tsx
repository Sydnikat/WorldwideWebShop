import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './App.css'
import { ChakraProvider, Grid, GridItem} from '@chakra-ui/react'
import {Route, BrowserRouter as Router, Switch, RouteComponentProps} from 'react-router-dom';
import CustomerMainPage from "./pages/CustomerMainPage";
import UserProfilePage from "./pages/UserProfilePage";
import {loginRoute, registerRoute, homeRoute, profileRoute, inspectRoute, orderRoute} from './constants/routeConstants';
import LoginRedirect from "./components/routing/LoginRedirect";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import PrivateRoute from "./components/routing/PrivateRoute";
import {CUSTOMER} from "./constants/roleConstants";
import ItemPage from "./pages/ItemPage";
import Navbar from "./layout/Navbar";
import Content from "./layout/Content";
import Footer from "./layout/Footer";
import CheckoutPage from './pages/CheckoutPage'

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
            <Grid
              height="100vh"
              maxHeight="100vh"
              templateRows="auto 1fr auto"
            >
              <GridItem>
                <Navbar />
              </GridItem>
              <GridItem overflow="auto"  backgroundColor="gray.100" >
                <Content>
                  <PrivateRoute path={homeRoute} exact roles={[CUSTOMER]} component={CustomerMainPage} />
                  <PrivateRoute path={profileRoute} exact roles={[CUSTOMER]} component={UserProfilePage} />
                  <PrivateRoute path={`${inspectRoute}/:itemId`} exact roles={[CUSTOMER]} component={ItemPage} />
                  <PrivateRoute path={`${orderRoute}/:orderId`} exact roles={[CUSTOMER]} component={CheckoutPage} />
                </Content>
              </GridItem>
              <GridItem bg="blue.300">
                <Footer />
              </GridItem>
            </Grid>
          </Switch>
        </Router>

      </ChakraProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
