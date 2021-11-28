import "./RestaurantCard.css";
import { Rating } from "@material-ui/lab";
import React from "react";
import useToken from "../../App/useToken";

import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function RestaurantCard(props) {
  const classes = useStyles();
// getModalStyle is not a pure function, we roll the style only on the first render
const [modalStyle] = React.useState(getModalStyle);
const [open, setOpen] = React.useState(false);

const handleOpen = () => {
  setOpen(true);
};

const handleClose = () => {
  setOpen(false);
};

const body = (
  <div style={modalStyle} className={classes.paper}>
    <h2 id="simple-modal-title">Added to favorites</h2>
    <p id="simple-modal-description">
      You can check your favorite restaurants or airbnbs in "Favorites".
    </p>
  </div>
);







  const token = useToken();
  const username = token[0]?.username;
  const uid = token[0]?.id;
  const addToFavorite = async (id) => {
    const res = await fetch(
      "http://localhost:8080/saveFavoriteRestaurantsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          rid: id,
        }),
      }
    ).then((data) => data.json());
    console.log(res);
  };




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
                  <a>{props.restaurant.name}</a>
                </div>

                <div class={"s-something__content"}>
                  {props.restaurant.category +
                    " | " +
                    "$".repeat(props.restaurant.price_range)}

                </div>

                <div class="s-something__meta-2">
                  <a class="s-something__tag" href="#">
                    <Rating
                      defaultValue={props.restaurant.stars}
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
                  <a href="#">{'" ' + props.restaurant.address + '"'}</a>
                </p>
                <a
                  className={"nearbybutton"}
                  href={`/restaurant/view/${props.restaurant.id}`}
                >
                  View Nearby Airbnbs
                </a>
                <br />
                {username && (
                  <a
                    className={"nearbybutton"}
                    onClick={() => {addToFavorite(props.restaurant.id); handleOpen();}}
                  >
                    Add to Favorite
                  </a>
                )}
              </div>
              <Modal
       open={open}
       onClose={handleClose}
       aria-labelledby="simple-modal-title"
       aria-describedby="simple-modal-description"
     >
       {body}
     </Modal>
              <div class="s-something__image-container">
                <div class="s-something__image-placeholder">
                  <a href="#">
                    <img
                      class="s-something__image"
                      src={props.restaurant.image}
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
