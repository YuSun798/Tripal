import React from "react";
import AirBnbCard from "./AirBnbCard";
import "./SearchAirBnb.css";
import RegisterLogin from "../Dashboard/RegisterLogin";
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
  OverlayView,
} from "@react-google-maps/api";
import { Rating } from "@material-ui/lab";
import ReactPaginate from "react-paginate";
import Select from "react-select";

const mapContainerStyle = {
  height: "100%",
};

const divStyle = {
  background: `white`,
  padding: 10,
};

const SortByMap = {
  star: "pr.review_scores_rating DESC",
  review: "pr.number_of_reviews DESC",
  price: "p.price ASC",
};

const defaultRoomType = ["Private Room", "Hotel Room"];
const defaultBathroom = ["1 bath"];
const defaultBedroomNum = [1];

export default class SearchAirBnb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openInfoWindowMarkerId: "",
      isInfoWindowOpen: false,
      airbnbs: [],
      currentPageResData: [],
      currentPage: 0, //currentPage is the index of the page selected by the user, initially you may want to set it to 0.
      boroughArray: [],
      sortBy: SortByMap.star,
      borough: "Manhattan",
      roomTypeArray: [],
      roomTypeSelected: defaultRoomType,
      bathroomArray: [],
      bathroomSelected: defaultBathroom,
      bedroomNumArray: [],
      bedroomNumSelected: defaultBedroomNum,
    };
    this.PER_PAGE = 10;
    this.handleToggleOpen = this.handleToggleOpen.bind(this);
    this.handleToggleClose = this.handleToggleClose.bind(this);
    this.getSearchResults = this.getSearchResults.bind(this);
    this.getBoroughs = this.getBoroughs.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.refresh = this.refresh.bind(this);
    this.updateBorough = this.updateBorough.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
    this.updateRoomTypeSelected = this.updateRoomTypeSelected.bind(this);
    this.updateBathroomSelected = this.updateBathroomSelected.bind(this);
    this.updateBedroomNumSelected = this.updateBedroomNumSelected.bind(this);
  }
  async componentDidMount() {
    await this.getSearchResults();
    await this.getBoroughs();
    await this.getAllRoomTypes();
    await this.getAllBathrooms();
    await this.getAllBedroomNums();

    this.setState({
      currentPageResData: this.state.airbnbs.slice(
        this.state.currentPage * this.PER_PAGE,
        this.state.currentPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
    console.log(this.state.currentPageResData);
  }

  async refresh() {
    await this.getSearchResults(
      this.state.borough,
      SortByMap[this.state.sortBy],
      this.state.roomTypeSelected,
      this.state.bathroomSelected,
      this.state.bedroomNumSelected
    );
    this.setState({
      currentPageResData: this.state.airbnbs.slice(
        this.state.currentPage * this.PER_PAGE,
        this.state.currentPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
  }

  handlePageClick({ selected: selectedPage }) {
    this.setState({
      currentPage: selectedPage,
      currentPageResData: this.state.airbnbs.slice(
        selectedPage * this.PER_PAGE,
        selectedPage * this.PER_PAGE + this.PER_PAGE
      ),
    });
    console.log(this.state.currentPageResData);
  }
  handleToggleClose() {
    this.setState({
      isInfoWindowOpen: false,
    });
  }
  updateBorough(newBorough) {
    this.setState({
      borough: newBorough,
    });
  }
  updateSortBy(newSortBy) {
    this.setState({
      sortBy: newSortBy,
    });
  }

  updateRoomTypeSelected(newRoomType) {
    this.setState({
      roomTypeSelected: newRoomType.map((e) => {
        return e["value"];
      }),
    });
  }

  updateBathroomSelected(newBathroom) {
    this.setState({
      bathroomSelected: newBathroom.map((e) => {
        return e["value"];
      }),
    });
  }

  updateBedroomNumSelected(newBedroomNum) {
    this.setState({
      bedroomNumSelected: newBedroomNum.map((e) => {
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

  async getBoroughs() {
    //get all boroughs in NYC
    const res = await fetch("http://localhost:8080/getAllBorough", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    this.setState({
      boroughArray: res,
    });
  }

  async getAllRoomTypes() {
    //get all price range
    const res = await fetch("http://localhost:8080/getRoomTypes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      roomTypeArray: res,
    });
  }

  async getAllBathrooms() {
    //get all price range
    const res = await fetch("http://localhost:8080/getBathrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      bathroomArray: res,
    });
  }

  async getAllBedroomNums() {
    //get all price range
    const res = await fetch("http://localhost:8080/getBedrooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      bedroomNumArray: res,
    });
  }

  async getSearchResults(borough, sortBy, roomType, bathroom, bedroomNum) {
    //call backend API and get a list of airbnb properties.
    const res = await fetch("http://localhost:8080/getSortedAirBNB", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        borough: borough || this.state.borough,
        sortBy: sortBy || this.state.sortBy,
        roomType: roomType || this.state.roomTypeSelected,
        bathroom: bathroom || this.state.bathroomSelected,
        bedroomNum: bedroomNum || this.state.bedroomNumSelected,
      }),
    }).then((data) => data.json());
    console.log(res);
    this.setState({
      airbnbs: res,
    });
  }

  render() {
    //Pagination

    //Google map markers
    const markers = this.state.currentPageResData.map((airbnb, i) => {
      const lat = airbnb.latitude;
      const lng = airbnb.longitude;
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
              {airbnb.name}
            </div>
          </OverlayView>
          {this.state.isInfoWindowOpen &&
            this.state.openInfoWindowMarkerId == i && (
              <InfoWindow onCloseClick={() => this.handleToggleClose()}>
                <div style={divStyle}>
                  <div style={{ position: "absolute" }}>
                    <img
                      style={{ width: "100px" }}
                      src={airbnb.picture_url}
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
                      {airbnb.name}
                    </h3>
                    <Rating
                      style={{ marginTop: "-30px", size: "50%" }}
                      defaultValue={airbnb.review_scores_rating / 10}
                      precision={0.5}
                      readOnly
                    />
                    <p>
                      {airbnb.property_type +
                        "| " +
                        airbnb.room_type +
                        "| " +
                        airbnb.bedrooms +
                        "| " +
                        airbnb.bathrooms_text}
                    </p>
                    <p>{airbnb.description}</p>
                  </div>
                </div>
              </InfoWindow>
            )}
        </Marker>
      );
    });
    const pageCount = Math.ceil(this.state.airbnbs.length / this.PER_PAGE);

    const boroughOptions = this.state.boroughArray.map((data) => {
      return { value: data["borough"], label: data["borough"] };
    });

    const roomTypeOptions = this.state.roomTypeArray.map((data) => {
      return { value: data["room_type"], label: data["room_type"] };
    });

    const bathroomOptions = this.state.bathroomArray.map((data) => {
      return { value: data["bathrooms_text"], label: data["bathrooms_text"] };
    });

    const bedroomNumOptions = this.state.bedroomNumArray.map((data) => {
      return { value: data["bedrooms"], label: data["bedrooms"] };
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
                <a href="/airbnb" title="Airbnbs">
                  Airbnbs
                </a>
              </li>
              <li>
                <a href="/restaurant" title="Restuarants">
                  Restuarants
                </a>
              </li>
              <RegisterLogin />
            </ul>
          </div>
        </div>
        {/*  SIDEBAR  */}
        <div className="box sidebar">
          {/*Query, and Filters*/}
          <div className="topfilter">
            <label>
              Borough:
              <Select
                options={boroughOptions}
                onChange={(e) => this.updateBorough(e["value"])}
                styles={{
                  container: () => ({ width: "100px", marginLeft: "5px" }),
                }}
              />
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
          <div className="subfilter0">
            <label id="roomFilter">
              Room Type:
              <Select
                options={roomTypeOptions}
                isMulti
                onChange={(e) => this.updateRoomTypeSelected(e)}
                styles={{
                  container: () => ({ width: "230px", marginLeft: "5px" }),
                }}
              />
            </label>
          </div>
          <br />

          <div className="subfilter">
            <label id="bathroomFilter">
              Bathroom:
              <Select
                options={bathroomOptions}
                isMulti
                onChange={(e) => this.updateBathroomSelected(e)}
                styles={{
                  container: () => ({ width: "200px", marginLeft: "5px" }),
                }}
              />
            </label>
          </div>
          <br />

          <div className="lastfilter">
            <label>
              Bedroom Number:
              <Select
                options={bedroomNumOptions}
                isMulti
                onChange={(e) => this.updateBedroomNumSelected(e)}
                styles={{
                  container: () => ({ width: "243px", marginLeft:"-28px" }),
                }}
              />
            </label>
          </div>
          <br />

          <br />
          <button
            className={"button"}
            type="button"
            onClick={() => this.refresh()}
          >
            Search
          </button>

          {/*  CARD  */}
          {this.state.currentPageResData.map((e) => {
            return <AirBnbCard airbnb={e} key={e.name} />;
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
          {this.state.currentPageResData.length > 0 && (
            <>
              <LoadScript googleMapsApiKey="AIzaSyAIObhztAybGSfFVSEQlQk6_Q5fS1zwxYo">
                <GoogleMap
                  id="data-example"
                  mapContainerStyle={mapContainerStyle}
                  zoom={13}
                  center={{
                    lat: this.state.currentPageResData[0].latitude,
                    lng: this.state.currentPageResData[0].longitude,
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
