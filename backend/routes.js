var config = require('./db-config.js');
var mysql = require('mysql');
var axios = require('axios');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */









//get all Restaurants based on the parameters
function getAllRestaurants(req, res) {
  var zip = req.body.zip;
  var sortBy = req.body.sortBy || "br.stars";
  var priceRange = req.body.priceRange || (1,2,3,4);
  var flavor = req.body.flavor ;
  var flavorArray = flavor.map(i => `'${i}'`).join(',') || (`'cafes'`);
  console.log(zip);
  var query = `
    SELECT DISTINCT b.business_id as id,b.name, br.stars, br.price_range, br.review_count, b.latitude, b.longitude, b.address, b.image, f.flavor as category
	FROM Business b JOIN Business_review br ON br.business_id=b.business_id
                    JOIN Flavor f ON br.business_id = f.business_id
	      AND br.stars>3 AND br.review_count>100 AND b.zip = '${zip}'
	      AND br.price_range IN (${priceRange}) AND f.flavor IN (${flavorArray})
	ORDER BY ${sortBy} DESC
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {

      res.json(rows);
    }
  });
};



//get restaurants by id
function getRestaurantByLoc(req, res) {
  var location = req.body.loc;
  console.log(location);
};


//get restaurants by id
function getRestaurantById(req, res) {
  var id = req.body.id;
  var query = `
    SELECT DISTINCT b.business_id as id,b.name, br.stars, br.price_range, br.review_count, b.latitude, b.longitude, b.address, b.image, f.flavor as category
	FROM Business b JOIN Business_review br ON br.business_id=b.business_id
                    JOIN Flavor f ON br.business_id = f.business_id
	      AND br.stars>3 AND br.review_count>100 AND b.business_id = '${id}'
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get user favorite restaurants by id
function getFavoriteRestaurantsByUserId(req, res) {
  var id = req.body.id;
  var query = `
    SELECT b.business_id as id,b.name, br.stars, br.price_range, br.review_count, b.latitude, b.longitude, b.address, b.image, f.flavor as category
	FROM Business_review br, Business b, Flavor f, user_favorite_restaurants ufr
	WHERE br.business_id=b.business_id AND br.business_id = f.business_id AND br.business_id = ufr.restaurant_id AND ufr.user_id = ${id}
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
//get user favorite restaurants by id
function getFavoriteAirbnbsByUserId(req, res) {
  var id = req.body.id;
  var query = `
    SELECT p.*, pr.number_of_reviews,pr.review_scores_rating
    FROM Property p, \`Property Review\` pr, user_favorite_airbnbs ufa
    WHERE pr.listing_id = p.listing_id AND pr.listing_id = ufa.airbnb_id AND ufa.user_id =${id}
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
//get user favorite restaurants by id
function saveFavoriteRestaurantsByUserId(req, res) {
  var uid = req.body.uid;
  var rid = req.body.rid;
  var query = `
INSERT INTO Tripal.user_favorite_restaurants
(user_id, restaurant_id)
VALUES(${uid}, '${rid}')
ON DUPLICATE KEY UPDATE    
user_id =${uid}, restaurant_id='${rid}'
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};
//get user favorite restaurants by id
function saveFavoriteAirbnbsByUserId(req, res) {
  var uid = req.body.uid;
  var aid = req.body.aid;
  var query = `
INSERT INTO Tripal.user_favorite_airbnbs
(user_id, airbnb_id)
VALUES(${uid}, '${aid}')
ON DUPLICATE KEY UPDATE    
user_id =${uid}, airbnb_id='${aid}'
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get airbnb by ID.

//get the price range of yelp business
function getAllPriceRange(req, res){
  var query = `
  SELECT DISTINCT price_range
FROM Business_review br
WHERE price_range IS NOT NULL
ORDER BY price_range
`;
  connection.query(query, function(err, rows){
    if (err) console(err);
    else{
      res.json(rows);
    }
  });
};

//get all flavors of yelp business
function getAllFlavor(req, res){
   var query = `
   SELECT DISTINCT flavor
FROM Flavor f
WHERE flavor <> ''
ORDER By flavor
`;
   connection.query(query, function(err, rows){
     if (err) console.log(err);
     else{
       res.json(rows);
     }
   });
};

//get the airbnbs near a restaurant by calculating the distance
function getAirbnbByDistance(req, res) {
  var lat = req.body.lat;
  var lon = req.body.lon;
  var dis = req.body.dis;// in miles
  var sortBy = req.body.sortBy;

  var query = `
  SELECT * FROM
	(SELECT p.*, pr.number_of_reviews, pr.review_scores_rating,
   69.0 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(p.latitude))
         * COS(RADIANS(${lat}))
         * COS(RADIANS(p.longitude - (${lon})))
         + SIN(RADIANS(p.latitude))
         * SIN(RADIANS(${lat}))))) AS distance
  FROM Property p, \`Property Review\` pr
  WHERE p.listing_id = pr.listing_id
  ) temp
  WHERE temp.distance <= ${dis}
  ORDER By ${sortBy}
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get the restaurants near an airbnb by calculating the distance
function getRestaurantByDistance(req, res) {
  var lat = req.body.lat;
  var lon = req.body.lon;
  var dis = req.body.dis;// in miles
  var sortBy = req.body.sortBy;

  var query = `
  SELECT * FROM
    (SELECT DISTINCT b.*, br.review_count, br.stars, br.price_range,
   69.0 * DEGREES(ACOS(LEAST(1.0, COS(RADIANS(b.latitude))
         * COS(RADIANS(${lat}))
         * COS(RADIANS(b.longitude - (${lon})))
         + SIN(RADIANS(b.latitude))
         * SIN(RADIANS(${lat}))))) AS distance
  FROM Business b, Business_review br
  WHERE b.business_id = br.business_id
  ) temp
  WHERE temp.distance <= ${dis}
  ORDER BY ${sortBy}
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


//get boroughs in NYC
function getAllBorough(req,res){
  var query = `
  SELECT DISTINCT borough
  FROM \`NYC zones\` nz
  `;
  connection.query(query, function(err, rows){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
}

//get airbnbs by id
function getAirBnbById(req, res) {
  var id = req.body.id;
  var query = `
	SELECT p.*, pr.number_of_reviews,pr.review_scores_rating
    FROM Property p, \`Property Review\` pr
    WHERE pr.listing_id = p.listing_id AND p.listing_id = ${id}
  `;
  console.log(query);
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get all the airbnbs by parameters
function getSortedAirBNB(req, res) {
  var borough = req.body.borough;
  var sortBy = req.body.sortBy;
  var roomType = req.body.roomType;
  var bathroom = req.body.bathroom;
  var bedroomNum = req.body.bedroomNum;

  var roomTypeArray = roomType.map(i => `'${i}'`).join(',') || (`'Private room'`);
  var bathroomArray = bathroom.map(i => `'${i}'`).join(',') || (`'1 bath'`);
  var query = `
	SELECT  p.*, pr.number_of_reviews,pr.review_scores_rating
    FROM Property p, (
         SELECT DISTINCT listing_id
         FROM Neighborhood n2
         WHERE n2.neighborhood_group_cleansed = '${borough}'
         ) n, \`Property Review\` pr
    WHERE n.listing_id = p.listing_id AND n.listing_id = pr.listing_id
          AND p.room_type IN (${roomTypeArray}) AND p.bathrooms_text IN (${bathroomArray})
          AND p.bedrooms IN (${bedroomNum})
    ORDER BY ${sortBy}
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

//get room types of airbnb properties
function getRoomTypes(req,res){
  var query = `
  SELECT DISTINCT room_type
   FROM Property p
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

//get bathrooms_text
function getBathrooms(req,res){
  var query = `
  SELECT DISTINCT bathrooms_text
FROM Property p
WHERE bathrooms_text <> ''
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

//get bedrooms
function getBedrooms(req,res){
  var query = `
  SELECT DISTINCT bedrooms
FROM Property p
WHERE bedrooms IS NOT NULL
ORDER BY bedrooms
  `;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getTop5ZipPerFlavor(req, res) {
  var selectedFlavor = req.body.flavor;

  var query = `
	SELECT business.zip as zip, count(*)
	FROM flavor join business on flavor.business_id= business.bussiness_id
	WHERE flavor.flavor = '${selectedFlavor}'
	GROUP BY business.zip
	ORDER BY count(*) DESC
	LIMIT 5
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};


function getRestaurantService(req, res) {
  var resturant = req.body.resturant;

  var query = `
  	SELECT s.service
	FROM service s join business b on s.business_id=b.business_id
	WHERE b.name='${selectedFlavor}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getLargestZipPerFlavor(req, res) {
	var selectedFlavor = req.params.flavor;

	var query = `
    SELECT business.zip as zip
	FROM flavor join business on flavor.business_id= business.bussiness_id
	WHERE flavor.flavor = '${selectedFlavor}'
	GROUP BY business.zip
	ORDER BY count(*) DESC
	LIMIT 1
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getBestNeighborhoodComments(req, res) {
  var neighborhood = req.params.neighborhood;

  var query = `
  	SELECT n.neighborhood_overview, p.listing_url
	FROM neighborhood n join property p on n.id=p.listing_id join property_review pr on n.id=pr.listing_id
	WHERE n. neighborhood_cleanse='${selectedFlavor}'
	ORDER BY pr.review_scores_rating DESC
	LIMIT 5
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getWorstNeighborhoodComments(req, res) {
  var neighborhood = req.params.neighborhood;

  var query = `
	SELECT n.neighborhood_overview, p.listing_url
	FROM neighborhood n join property p on n.id=p.listing_id join property_review pr on n.id=pr.listing_id
	WHERE n. neighborhood_cleanse='${selectedFlavor}'
	ORDER BY pr.review_scores_rating ASC
	LIMIT 5
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getRecPerPriceAndLocation(req, res) {
  var priceHigh = req.params.priceHigh;
  var priceLow = req.params.priceLow;
  var neighborhood = req.params.neighborhood;

  var query = `
	SELECT p(*), pr.number_of_reivews
	FROM neighborhood n join property p on n.id=p.listing_id join property_review pr on n.id=pr.listing_id
	WHERE p.price <'${priceHigh}'AND p.price>'${priceLow}' AND n. neighborhood_cleansed='${neighborhood}'
	ORDER BY pr.review_scores_rating DESC
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};





function getAirBNBComments(req, res) {
  var AirBNBid = req.body.id;

  var query = `
	SELECT ar(*)
	FROM property p join Airbnb_review ar on p.id=ar.id
	WHERE p.id='${AirBNBid}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};




// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllRestaurants: getAllRestaurants,
    getRestaurantById: getRestaurantById,
    getAllPriceRange: getAllPriceRange,
    getAllFlavor: getAllFlavor,
    getAirbnbByDistance: getAirbnbByDistance,
    getAllBorough:getAllBorough,
    getRestaurantByDistance:getRestaurantByDistance,
    getSortedAirBNB: getSortedAirBNB,
    getAirBnbById:getAirBnbById,
    getRoomTypes:getRoomTypes,
    getBathrooms:getBathrooms,
    getBedrooms:getBedrooms,
    getFavoriteRestaurantsByUserId: getFavoriteRestaurantsByUserId,
    getFavoriteAirbnbsByUserId: getFavoriteAirbnbsByUserId,
    saveFavoriteRestaurantsByUserId: saveFavoriteRestaurantsByUserId,
    saveFavoriteAirbnbsByUserId: saveFavoriteAirbnbsByUserId,


    getTop5ZipPerFlavor: getTop5ZipPerFlavor,
	getRestaurantService: getRestaurantService,
	getLargestZipPerFlavor: getLargestZipPerFlavor,
  	getBestNeighborhoodComments: getBestNeighborhoodComments,
  	getWorstNeighborhoodComments: getWorstNeighborhoodComments,
  	getRecPerPriceAndLocation: getRecPerPriceAndLocation,

  	getAirBNBComments: getAirBNBComments
}
