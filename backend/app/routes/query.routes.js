const controller = require("../../routes");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/getRestaurantByLoc", (req,res)=>{controller.getRestaurantByLoc(req,res)});
  app.post("/getAllRestaurants", (req,res)=>{controller.getAllRestaurants(req,res)});
  app.post("/getRestaurantById", (req,res)=>{controller.getRestaurantById(req,res)});
  app.post("/getFavoriteRestaurantsByUserId", (req,res)=>{controller.getFavoriteRestaurantsByUserId(req,res)});
  app.post("/getFavoriteAirbnbsByUserId", (req,res)=>{controller.getFavoriteAirbnbsByUserId(req,res)});
  app.post("/saveFavoriteRestaurantsByUserId", (req,res)=>{controller.saveFavoriteRestaurantsByUserId(req,res)});
  app.post("/saveFavoriteAirbnbsByUserId", (req,res)=>{controller.saveFavoriteAirbnbsByUserId(req,res)});
  app.post("/getAllPriceRange",  (req,res)=>{controller.getAllPriceRange(req,res)});
  app.post("/getAllFlavor",  (req,res)=>{controller.getAllFlavor(req,res)});
  app.post("/getAirbnbByDistance",  (req,res)=>{controller.getAirbnbByDistance(req,res)});
  app.post("/getAllBorough",  (req,res)=>{controller.getAllBorough(req,res)});
  app.post("/getRestaurantByDistance",  (req,res)=>{controller.getRestaurantByDistance(req,res)});
  app.post("/getSortedAirBNB",(req,res)=>{controller.getSortedAirBNB(req,res)});
  app.post("/getAirBnbById",(req,res)=>{controller.getAirBnbById(req,res)});
  app.post("/getRoomTypes",(req,res)=>{controller.getRoomTypes(req,res)});
  app.post("/getBathrooms",(req,res)=>{controller.getBathrooms(req,res)});
  app.post("/getBedrooms",(req,res)=>{controller.getBedrooms(req,res)});


  app.post("/getTop5ZipPerFlavor",(req,res)=>{controller.getTop5ZipPerFlavor(req,res)});
  app.post("/getRestaurantService",(req,res)=>{controller.getRestaurantService(req,res)});
  app.post("/getLargestZipPerFlavor",(req,res)=>{controller.getLargestZipPerFlavor(req,res)});
  app.post("/getBestNeighborhoodComments",(req,res)=>{controller.getBestNeighborhoodComments(req,res)});
  app.post("/getWorstNeighborhoodComments",(req,res)=>{controller.getWorstNeighborhoodComments(req,res)});
  app.post("/getRecPerPriceAndLocation",(req,res)=>{controller.getRecPerPriceAndLocation(req,res)});
  app.post("/getAirBNBComments",(req,res)=>{controller.getAirBNBComments(req,res)});
};
