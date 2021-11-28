import "./AirBnbCard.css";
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



export default function AirBnbCard(props) {

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
      "http://localhost:8080/saveFavoriteAirbnbsByUserId",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          aid: id,
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
                  <a href={props.airbnb.listing_url}>{props.airbnb.name}</a>
                </div>

                <div class="s-something__meta-2">
                  <a class="s-something__tag" href="#">
                    <Rating
                      defaultValue={props.airbnb.review_scores_rating / 10}
                      precision={0.5}
                      readOnly
                    />
                    {props.airbnb.number_of_reviews}
                  </a>
                </div>

                <div class="s-something__meta-footer">
                  <div class="s-something__meta-dos">
                    {props.airbnb.property_type +
                      "| " +
                      props.airbnb.room_type +
                      "| " +
                      props.airbnb.bedrooms +
                      " bedrooms" +
                      " | " +
                      props.airbnb.bathrooms_text}
                  </div>
                </div>
                <br />
                <p className="s-something__standfirst">
                  <a href="#">{'" ' + props.airbnb.amenities + '"'}</a>
                </p>
                <a
                  className={"nearbybutton"}
                  href={`/airbnb/view/${props.airbnb.listing_id}`}
                >
                  View Nearby Restaurants
                </a>
                <br />
                {username && (
                  <a
                    className={"nearbybutton"}
                    onClick={() => {addToFavorite(props.airbnb.listing_id); handleOpen();}}
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
                      src={props.airbnb.picture_url}
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
