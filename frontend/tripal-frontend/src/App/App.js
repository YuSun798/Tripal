import React, { useState } from "react";
import { BrowserRouter, Route, Switch, Link,  } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import Dashboard from "../components/Dashboard/Dashboard";
import Preferences from "../components/Preferences/Preferences";
import LoginComponent from "../components/Login/Login";

import useToken from "./useToken";
import MapviewComponent from "../components/Mapview/Mapview";
import SearchRestaurant from "../components/SearchRestaurant/SearchRestaurant";
import SearchAirBnb from "../components/SearchAirBnb/SearchAirBnb";
import RestaurantDetail from "../components/SearchRestaurant/RestaurantDetail";
import AirbnbDetail from "../components/SearchAirBnb/AirbnbDetail";
import Favorites from "../components/Preferences/Favorites";
import SearchRestaurantApi from "../components/SearchRestaurant/SearchRestaurantApi";

function App() {
  const [token, setToken] = useToken();
  const customHistory = createBrowserHistory();
  return (
    <>
      <div className="app-wrapper">
        <BrowserRouter history={customHistory}>
          <Switch>
            <Route exact path="/" render={() => <Dashboard />} />
            <Route path="/dashboard">
              <Dashboard />
            </Route>

            <Route path="/mapview">
              <MapviewComponent />
            </Route>

            <Route path="/preferences">
              <Preferences />
            </Route>

            <Route exact path="/restaurantApi/:loc"
            component={SearchRestaurantApi}>
            </Route>

            <Route exact path="/restaurant">
              <SearchRestaurant />
            </Route>
            <Route exact path="/Favorites">
              <Favorites />
            </Route>

            <Route
              exact
              path="/restaurant/view/:id"
              component={RestaurantDetail}
            />

            <Route exact path="/airbnb/view/:id" component={AirbnbDetail} />

            <Route path="/airbnb">
              <SearchAirBnb />
            </Route>

            <Route path="/login">
              <LoginComponent setToken={setToken} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
