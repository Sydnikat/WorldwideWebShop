import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import './App.css'
import { ChakraProvider, Grid, GridItem} from '@chakra-ui/react'
import {Route, BrowserRouter as Router, Switch, RouteComponentProps} from 'react-router-dom';
import CustomerMainPage from "./pages/user/CustomerMainPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import {
  loginRoute,
  registerRoute,
  homeRoute,
  profileRoute,
  inspectRoute,
  orderRoute,
  notFoundRoute, searchRoute, adminRoute, adminHomeRoute
} from './constants/routeConstants';
import LoginRedirect from "./components/routing/LoginRedirect";
import Login from "./pages/public/Login";
import Registration from "./pages/public/Registration";
import PrivateRoute from "./components/routing/PrivateRoute";
import {ADMIN, CUSTOMER} from "./constants/roleConstants";
import ItemPage from "./pages/user/ItemPage";
import Content from "./layout/Content";
import Footer from "./layout/Footer";
import CheckoutPage from './pages/user/CheckoutPage'
import NotFoundPage from "./pages/user/NotFoundPage";
import SearchPage from "./pages/user/SearchPage";
import {NavigationContextProvider} from "./providers/NavigationContext";
import AdminLogin from "./pages/public/AdminLogin";
import AdminMainPage from "./pages/management/AdminMainPage";
import NavbarProxy from "./layout/navbar/NavbarProxy";
import {InventoryContextProvider} from "./providers/InventoryContext";

const queryClient = new QueryClient();

function App() {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContextProvider>
        <InventoryContextProvider>
          <Router>
            <Switch>
              <Route path='/' exact component={LoginRedirect} />
              <Route path={loginRoute} exact component={Login} />
              <Route path={registerRoute} exact component={Registration} />
              <Route path={adminRoute} exact component={AdminLogin} />
              <Grid
                height="100vh"
                maxHeight="100vh"
                templateRows="auto 1fr auto"
              >
                <GridItem>
                  <NavbarProxy />
                </GridItem>
                <GridItem overflow="auto"  backgroundColor="gray.100" >
                  <Content>
                    <PrivateRoute path={homeRoute} exact roles={[CUSTOMER]} component={CustomerMainPage} />
                    <PrivateRoute path={profileRoute} exact roles={[CUSTOMER]} component={UserProfilePage} />
                    <PrivateRoute path={`${inspectRoute}/:itemId`} exact roles={[ADMIN, CUSTOMER]} component={ItemPage} />
                    <PrivateRoute path={`${orderRoute}/:orderId`} exact roles={[CUSTOMER]} component={CheckoutPage} />
                    <PrivateRoute path={notFoundRoute} exact roles={[ADMIN, CUSTOMER]} component={NotFoundPage} />
                    <PrivateRoute path={searchRoute} exact roles={[ADMIN, CUSTOMER]} component={SearchPage} />

                    <PrivateRoute path={adminHomeRoute} exact roles={[ADMIN]} component={AdminMainPage} />
                  </Content>
                </GridItem>
                <GridItem bg="blue.300">
                  <Footer />
                </GridItem>
              </Grid>
            </Switch>
          </Router>
        </InventoryContextProvider>
        </NavigationContextProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ChakraProvider>
  )
}

export default App
