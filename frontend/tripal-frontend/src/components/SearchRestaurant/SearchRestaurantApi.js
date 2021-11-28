import React, { Component } from "react";
import Select from "react-select";
import RestaurantCardApi from "./RestaurantCardApi";
import "./SearchRestaurantApi.css";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { Rating } from "@material-ui/lab";
import ReactPaginate from "react-paginate";

const mapContainerStyle = {
  height: "100%",
};

const divStyle = {
  background: `white`,
  padding: 10,
};

const SortByMap = {
  star: "br.stars",
  review: "br.review_count",
};

const defaultFlavors = [
  " italian",
  " pizza",
  " newamerican",
  " mexican",
  " chinese",
  " japanese",
  " bars",
  " delis",
  " tradamerican",
  " sushi",
];

const defaultPriceRange = [1, 2, 3, 4];

export default class SearchRestaurantApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openInfoWindowMarkerId: "",
      isInfoWindowOpen: false,
      restaurants: [],
      currentPageResData: [],
      currentPage: 0, //currentPage is the index of the page selected by the user, initially you may want to set it to 0.
      sortBy: SortByMap.star,
      zipcode: "10003",
      priceRangeArray: [],
      priceRangeSelected: defaultPriceRange,
      flavorArray: [],
      flavorSelected: defaultFlavors,
      location: this.props.match.params.loc,
    };

    this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
    this.getRestaurants = this.getRestaurants.bind(this);

    this.PER_PAGE = 10;

    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleToggleClose = this.handleToggleClose.bind(this);

    this.getSearchResults = this.getSearchResults.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.refresh = this.refresh.bind(this);
    this.updateZipcode = this.updateZipcode.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
    this.updatePriceRangeSelected = this.updatePriceRangeSelected.bind(this);
    this.updateFlavorSelected = this.updateFlavorSelected.bind(this);
  }


componentWillMount() {
  console.log(this.state.location);

  this.getRestaurants();
  this.setState({
    currentPageResData: this.state.restaurants.slice(
      this.state.currentPage * this.PER_PAGE,
      this.state.currentPage * this.PER_PAGE + this.PER_PAGE
    ),
  });
  console.log(this.state.currentPageResData);

}


  async componentDidMount() {
    console.log(this.state.location);

    this.getRestaurants();
    this.setState({
      currentPageResData: this.state.restaurants.slice(
        this.state.currentPage * this.PER_PAGE,
        this.state.currentPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
    console.log(this.state.currentPageResData);
  }


handleSearchFieldChange(e) {
  this.setState({
    location: e.target.value,
  })
}


  getRestaurants() {
    fetch("http://localhost:8080/api/"+this.state.location,
        {
          method: 'GET' // The type of HTTP request.
        }).then(res => {
          // Convert the response data to a JSON.
          return res.json();
        }, err => {
          // Print the error if there is one.
          console.log(err);
        }).then(reslist => {
          if (!reslist) return;
        console.log(reslist);
        this.setState({
          restaurants: reslist,
        })
         console.log(this.state.restaurants[0].location.zip_code);
         this.setState({
           zipcode: this.state.restaurants[0].location.zip_code,
         })
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
  }
  async refresh() {
    await this.getSearchResults(
      this.state.zipcode,
      SortByMap[this.state.sortBy],
      this.state.priceRangeSelected || [1, 2, 3, 4],
      this.state.flavorSelected
    );
    this.setState({
      currentPageResData: this.state.restaurants.slice(
        this.state.currentPage * this.PER_PAGE,
        this.state.currentPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
  }

  handlePageClick({ selected: selectedPage }) {
    this.setState({
      currentPage: selectedPage,
      currentPageResData: this.state.restaurants.slice(
        selectedPage * this.PER_PAGE,
        selectedPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
    console.log(this.state.currentPageResData);
  }
  handleToggleClose() {
    this.setState({
      isInfoWindowOpen: false,
      openInfoWindowMarkerId: "",
    });
  }
  updateZipcode(newZipcode) {
    this.setState({
      zipcode: newZipcode,
    });
  }
  updateSortBy(newSortBy) {
    this.setState({
      sortBy: newSortBy,
    });
  }

  updatePriceRangeSelected(newPriceRange) {
    this.setState({
      priceRangeSelected: newPriceRange.map((e) => {
        return e["value"];
      }),
    });
  }

  updateFlavorSelected(newFlavor) {
    this.setState({
      flavorSelected: newFlavor.map((e) => {
        return e["value"];
      }),
    });
  }
  handleToggleOpen(markerId) {
    this.setState({
      isInfoWindowOpen: true,
      openInfoWindowMarkerId: markerId,
    });
  }

  async getSearchResults(zip, sortBy, priceRange, flavor) {
    //call backend API and get a list of restaurant.
    //convert to above restaurant model and save to restaurants.
    const res = await fetch("http://localhost:8080/getAllRestaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zip: zip || this.state.zipcode,
        sortBy: sortBy || this.state.sortBy,
        priceRange: priceRange || this.state.priceRangeSelected,
        flavor: flavor || this.state.flavorSelected,
      }),
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      restaurants: res,
    });
  }

  async getAllPriceRange() {
    //get all price range
    const res = await fetch("http://localhost:8080/getAllPriceRange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      priceRangeArray: res,
    });
  }

  async getAllFlavor() {
    //get all flavors
    const res = await fetch("http://localhost:8080/getAllFlavor", {
      method: "POST",
      header: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      flavorArray: res,
    });
  }
  render() {















    //Pagination

    //Google map markers


    const markers = this.state.restaurants.map((restaurant, i) => {
      const lat = restaurant.coordinates.latitude;
      const lng = restaurant.coordinates.longitude;
      const index = i + 1;
      return (
        <Marker
          key={i}
          position={{ lat: lat, lng: lng }}
          onClick={() => this.handleToggleOpen(i)}
        >
          <OverlayView
            key="mwl"
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
                      style={{ width: "100px", height: "80px" }}
                      src={restaurant.image_url}
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
                      defaultValue={restaurant.rating}
                      precision={0.5}
                      readOnly
                    />
                    {/*<p>*/}
                    {/*  {restaurant.address +*/}
                    {/*    ", " +*/}
                    {/*    restaurant.city +*/}
                    {/*    ", " +*/}
                    {/*    restaurant.state +*/}
                    {/*    ", " +*/}
                    {/*    restaurant.postal_code}*/}
                    {/*</p>*/}
                    <p>{restaurant.location.address1+", "+restaurant.location.city}</p>
                  </div>
                </div>
              </InfoWindow>
            )}
        </Marker>
      );
    });
    const pageCount = Math.ceil(this.state.restaurants.length / this.PER_PAGE);
    const priceOptions = this.state.priceRangeArray.map((data) => {
      return { value: data["price_range"], label: data["price_range"] };
    });

    const flavorOptions = this.state.flavorArray.map((data) => {
      return { value: data["flavor"], label: data["flavor"] };
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
                <a href="airbnb" className="btn" title="Airbnbs">
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
          {/*Query, and Filters*/}
          <div className="filters">
            <label>
              Zipcode:
              <input
                value={this.state.zipcode}
                onChange={(e) => this.updateZipcode(e.target.value)}
                type="search"
              ></input>
            </label>
            <br />

            <label>
              SortBy:
              <select onChange={(e) => this.updateSortBy(e.target.value)}>
                {Object.keys(SortByMap).map((e) => {
                  return (
                    <option selected={SortByMap[e] == this.state.sortBy}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </label>

            <br />
          </div>
          <br />
          <div className="filters" id="priceFilter">
            <label>
              Price Range:
              <Select
                options={priceOptions}
                isMulti
                onChange={(e) => this.updatePriceRangeSelected(e)}
                styles={{
                  container: () => ({ width: "300px", marginLeft: "-25px" }),
                }}
              />
            </label>
          </div>
          <br />
          <div className="filters">
            <label>
              Flavor:
              <Select
                options={flavorOptions}
                isMulti
                onChange={(e) => this.updateFlavorSelected(e)}
                styles={{
                  container: () => ({ width: "270px", marginLeft: "5px" }),
                }}
              />
            </label>
          </div>

          <br />
          <button
            className={"button"}
            type="button"
            onClick={() => this.refresh()}
          >
            Search
          </button>

          {/*  CARD  */}
          {this.state.restaurants.map((e) => {
            return <RestaurantCardApi restaurant={e} key={e.name} />;
          })}
          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            pageCount={pageCount}
            onPageChange={this.handlePageClick}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </div>
        {/*  MAP  */}
        <div id="mapContainer">
          {this.state.restaurants.length > 0 && (
            <>
              <LoadScript googleMapsApiKey="AIzaSyAIObhztAybGSfFVSEQlQk6_Q5fS1zwxYo">
                <GoogleMap
                  id="data-example"
                  mapContainerStyle={mapContainerStyle}
                  zoom={16}
                  center={{
                    lat: this.state.restaurants[0].coordinates.latitude,
                    lng: this.state.restaurants[0].coordinates.longitude,
                  }}
                >
                  {markers}
                </GoogleMap>
              </LoadScript>
              <div className="searchBox">
                <form className="flex-form">
                  <label htmlFor="from">
                    <i className="fa fa-search"></i>
                  </label>
                  <input type="search" placeholder="Search another place..." />
                  <input type="submit" value="Search" onClick={this.handleSearchFieldChange}/>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}
