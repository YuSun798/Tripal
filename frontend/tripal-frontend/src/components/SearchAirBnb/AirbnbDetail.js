import React, { Component } from "react";
import Select from "react-select";
import AirBnbCard from "./AirBnbCard";
import "./AirbnbDetail.css";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { Rating } from "@material-ui/lab";
import ReactPaginate from "react-paginate";

import RestaurantCard from "../SearchRestaurant/RestaurantCard";

const mapContainerStyle = {
  height: "100%",
};

const divStyle = {
  background: `white`,
  padding: 10,
};

const SortByMap = {
  star: "temp.stars DESC",
  review: "temp.review_count DESC",
  distance: "temp.distance ASC",
};

export default class AirbnbDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openInfoWindowMarkerId: "",
      isInfoWindowOpen: false,
      restaurants: [],
      airbnbs: [],
      distance: "0.5",
      sortBy: SortByMap.star,
    };
    this.id = this.props.match.params.id;
    this.PER_PAGE = 10;
    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleToggleClose = this.handleToggleClose.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getNearbyRestaurants = this.getNearbyRestaurants.bind(this);
    this.refresh = this.refresh.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
  }
  async componentDidMount() {
    await this.getSearchResults();
    await this.getNearbyRestaurants(SortByMap[this.state.sortBy]);
  }

  async refresh() {
    await this.getSearchResults();
  }

  handleToggleClose() {
    this.setState({
      isInfoWindowOpen: false,
      openInfoWindowMarkerId: "",
    });
  }

  handleToggleOpen(markerId) {
    this.setState({
      isInfoWindowOpen: true,
      openInfoWindowMarkerId: markerId,
    });
  }

  updateSortBy(newSortBy) {
    this.setState({
      sortBy: newSortBy,
    });
  }

  async getSearchResults() {
    //call backend API and get a list of restaurant.
    //get the airbnb info by searching the id
    const res = await fetch("http://localhost:8080/getAirBnbById", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: this.id,
      }),
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      airbnbs: res,
    });
  }

  async getNearbyRestaurants(sortBy) {
    //find the restaurants near the airbnb
    const res = await fetch("http://localhost:8080/getRestaurantByDistance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lat: this.state.airbnbs[0].latitude,
        lon: this.state.airbnbs[0].longitude,
        dis: this.state.distance,
        sortBy: sortBy || this.state.sortBy,
      }),
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      restaurants: res,
    });
  }

  //TODO: modify the following map
  render() {
    //Pagination
    //Google map markers
    const airbnbMarkers = this.state.airbnbs.map((airbnb, i) => {
      const lat = airbnb.latitude;
      const lng = airbnb.longitude;
      const index = i + 1;
      return (
        <Marker key={"cur"} position={{ lat: lat, lng: lng }}>
          <OverlayView
            key="mwl"
            position={{ lat: lat, lng: lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                background: `#203254`,
                padding: `3px 6px`,
                fontSize: "11px",
                color: `white`,
                borderRadius: "4px",
                marginLeft: `-40px`,
              }}
            >
              {airbnb.name}
            </div>
          </OverlayView>
        </Marker>
      );
    });

    //center restaurant marker
    const markers = this.state.restaurants.map((restaurant, i) => {
      const lat = restaurant.latitude;
      const lng = restaurant.longitude;
      const index = i + 1;
      return (
        <Marker
          key={i}
          position={{ lat: lat, lng: lng }}
          onClick={() => this.handleToggleOpen(i)}
        >
          <OverlayView
            key={i}
            position={{ lat: lat, lng: lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div
              style={{
                background: `#dd5555`,
                padding: `3px 6px`,
                fontSize: "11px",
                color: `white`,
                borderRadius: "4px",
                marginLeft: `-40px`,
              }}
            >
              {restaurant.name}
            </div>
          </OverlayView>
          {this.state.isInfoWindowOpen &&
            this.state.openInfoWindowMarkerId == i && (
              <InfoWindow onCloseClick={() => this.handleToggleClose()}>
                <div style={divStyle}>
                  <div style={{ position: "absolute" }}>
                    <img
                      style={{ width: "100px" }}
                      src={restaurant.image}
                      alt=""
                    ></img>
                  </div>
                  <div style={{ marginLeft: "110px", marginTop: "-20px" }}>
                    <h3
                      style={{
                        color: "#d73851",
                        marginTop: "20px",
                        marginBottom: "15px",
                      }}
                    >
                      {restaurant.name}
                    </h3>
                    <Rating
                      style={{ marginTop: "-30px", size: "50%" }}
                      defaultValue={restaurant.stars}
                      precision={0.5}
                      readOnly
                    />
                    <p>{restaurant.address}</p>
                  </div>
                </div>
              </InfoWindow>
            )}
        </Marker>
      );
    });

    return (
      <div className="wrapper">
        {/*  HEADER  */}
        <div className="box header" id="titleDiv">
          <div className="nav">
            <ul>
              <li>
                <a href="/" className="btn" title="Home">
                  Home
                </a>
              </li>
              <li>
                <a href="/airbnb" className="btn" title="Airbnbs">
                  Airbnbs
                </a>
              </li>
              <li>
                <a href="/restaurant" className="btn" title="Restaurants">
                  Restuarants
                </a>
              </li>
              <li>
                <a href="/login" className="btn" title="Register / Log In">
                  Register/Log In
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/*  SIDEBAR  */}
        <div className="box sidebar">
          {this.state.airbnbs.map((e) => {
            return <p>Restaurants near {e.name}: </p>;
          })}

          {/*  Restaurants  */}
          <div>
            {/*//todo:add more filters.*/}
            <div className="filters">
              <label>
                SortBy:
                <select
                  onChange={(e) => {
                    this.updateSortBy(e.target.value);
                    this.getNearbyRestaurants(SortByMap[e.target.value]);
                  }}
                >
                  {Object.keys(SortByMap).map((e) => {
                    return (
                      <option selected={SortByMap[e] == this.state.sortBy}>
                        {e}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
          </div>
          {/*Render restaurants if any*/}
          {this.state.restaurants &&
            this.state.restaurants.map((e) => {
              return <RestaurantCard restaurant={e} />;
            })}
        </div>
        {/*  MAP  */}
        <div id="mapContainer">
          {this.state.restaurants.length > 0 && (
            <>
              <LoadScript googleMapsApiKey="AIzaSyAIObhztAybGSfFVSEQlQk6_Q5fS1zwxYo">
                <GoogleMap
                  id="data-example"
                  mapContainerStyle={mapContainerStyle}
                  zoom={19}
                  center={{
                    lat: this.state.restaurants[0].latitude,
                    lng: this.state.restaurants[0].longitude,
                  }}
                >
                  {markers}
                  {airbnbMarkers}
                </GoogleMap>
              </LoadScript>
              <div className="searchBox">
                <form className="flex-form">
                  <label htmlFor="from">
                    <i className="fa fa-search"></i>
                  </label>
                  <input type="search" placeholder="Search another place..." />
                  <input type="submit" value="Search" />
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
