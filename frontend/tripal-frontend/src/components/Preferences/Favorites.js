import React, { useEffect, useState } from "react";
import useToken from "../../App/useToken";
import RestaurantCard from "../SearchRestaurant/RestaurantCard";
import AirBnbCard from "../SearchAirBnb/AirBnbCard";
import "./Favorites.css";





export default function Favorites() {







  const token = useToken();
  const username = token[0]?.username;
  const uid = token[0]?.id;
  const [restaurants, setRestaurants] = useState();
  const [airbnbs, setAirbnbs] = useState();
  const getResults = async () => {
    const restaurants = await fetch(
      "http://localhost:8080/getFavoriteRestaurantsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uid,
        }),
      }
    ).then((data) => data.json());
    console.log(restaurants);
    setRestaurants(restaurants);

    const airbnbs = await fetch(
      "http://localhost:8080/getFavoriteAirbnbsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: uid,
        }),
      }
    ).then((data) => data.json());
    console.log(airbnbs);
    setAirbnbs(airbnbs);
  };
  useEffect(() => {
    getResults();
  }, []);





  return username ? (
    <>
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

        </ul>
      </div>
    </div>
    <div className="main">
    <div className="welcome">
      <p>Welcome {username}, here are your favorarites: </p>
    </div>
    <div className="restaurant">
        <h2>Restaurants:</h2>
          {restaurants && (
              <p>
                {restaurants.map((e) => {
                    return <RestaurantCard restaurant={e} key={e.name} />;
                  })}
              </p>
            )}
    </div>
    <div className="airbnb">
         <h2>Airbnbs:</h2>
           {airbnbs && (
               <p>
                 {airbnbs.map((e) => {
                   return <AirBnbCard airbnb={e} key={e.name} />;
                 })}
               </p>
           )}
     </div>
    </div>




    </>
  ) : (
    <p>Sorry, you need to login first!!!</p>
  );
}
