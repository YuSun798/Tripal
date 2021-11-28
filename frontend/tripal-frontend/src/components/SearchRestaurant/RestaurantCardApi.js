import "./RestaurantCardApi.css";
import { Rating } from "@material-ui/lab";
import React from "react";



export default function RestaurantCardApi(props) {
  return (
    <>
      <div class="card-container">
        <div class="row">
          <div class="col-xs-12 col-md-8">
            <div class="s-something s-something--small s-something--medium">
              <div class="s-something__content">
                <div class="s-something__meta">
                  <div class="s-something__meta-tag"></div>
                </div>

                <div class="s-something__heading">
                  <a href={props.restaurant.url}>
                    {props.restaurant.name}
                  </a>
                </div>

                <div class={"s-something__content"}>
                  {props.restaurant.categories[0].title +
                    " | " +
                    props.restaurant.price}{" "}
                </div>

                <div class="s-something__meta-2">
                  <a class="s-something__tag" href="#">
                    <Rating
                      defaultValue={props.restaurant.rating}
                      precision={0.5}
                      readOnly
                    />
                    {props.restaurant.review_count}
                  </a>
                </div>

                {/*<div class="s-something__meta-footer">*/}
                {/*  <div class="s-something__meta-dos">*/}
                {/*    {props.restaurant.address}*/}
                {/*  </div>*/}
                {/*</div>*/}

                <p class="s-something__standfirst">
                  <a href="#">{'" ' + props.restaurant.location.address1 + props.restaurant.location.city + '"'}</a>
                </p>
                <a className={"nearbybutton"} href={`/restaurant/view/${props.restaurant.id}`}>
                  View Nearby Airbnbs
                </a>
              </div>

              <div class="s-something__image-container">
                <div class="s-something__image-placeholder">
                  <a href="#">
                    <img
                      class="s-something__image"
                      src={props.restaurant.image_url}
                      alt=""
                    ></img>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
