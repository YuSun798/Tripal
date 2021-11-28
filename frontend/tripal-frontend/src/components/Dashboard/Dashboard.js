import React from "react";
import "./Dashboard.css";
import "font-awesome/css/font-awesome.min.css";
import { Link } from "react-router-dom";
import RegisterLogin from "./RegisterLogin";

export default class Dashboard extends React.Component {



  constructor(props) {
    super(props);

    // The state maintained by this React Component.

    this.state = {
      location: "",
      data:{}
    }

    //this.getRestaurants = this.getRestaurants.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);

  }

  handleFieldChange(e) {
    this.setState({
      location: e.target.value,
    });

  /*  fetch("http://localhost:8080/api/"+this.state.location,
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
        data: reslist,
      })

      }, err => {
        // Print the error if there is one.
        console.log(err);
      });*/
  }









  render() {
    return (
      <div className="container">
        <header>
          <h2>
            <a href="/">
              <i className="fa fa-plane"></i> Tripal
            </a>
          </h2>
          <nav>
            <ul>
              <li>
                <a href="/airbnb" title="Airbnbs">
                  Airbnbs
                </a>
              </li>
              <li>
                <a href="/restaurant" title="Restuarants">
                  Restaurants
                </a>
              </li>
              <RegisterLogin />
            </ul>
          </nav>
        </header>

        <div className="cover">
          <h1 style={{ marginBottom: "3rem" }}>Discover what's out there.</h1>
          <form className="flex-form">
            <label htmlFor="from">
              <i className="fa fa-search"></i>
            </label>
            <input type="search" placeholder="Where do you want to go?" value={this.state.location} onChange={this.handleFieldChange}/>
            <Link to={'/restaurantApi/'+this.state.location}><p id="searchBtn">Search</p></Link>
          </form>
        </div>
      </div>
    );
  }

}
