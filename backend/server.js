const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios =require('axios');


const app = express();

app.use(cors());
/*
var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));*/

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to tripal application." });
});



app.get('/api',(req,res)=>{
  var config = {
  method: 'get',
  url: 'https://api.yelp.com/v3/businesses/search?location=new york',
  headers: {
    'Authorization': 'Bearer NtID0sIuGBNCcZkU1pK1q6hMB1tq0t1Uofs8mTa8ac6HLrBm83ZvmV6X7lHQYoH2u8HkCAgke-7Y8tQr_dn8hpXgZMIrVto06mv8d9mARrr02FqrnU5OQywRbrx3YHYx'
  }
};
  console.log('请求到了')


axios(config)
.then(function (response) {
  const first = response.data.businesses[0];
  console.log(JSON.stringify(first,null,4));
  res.json(first);
})
.catch(function (error) {
  console.log(error);
});

})


app.get('/api/:location',(req,res)=>{
  var config = {
  method: 'get',
  url: 'https://api.yelp.com/v3/businesses/search?location='+req.params.location,
  headers: {
    'Authorization': 'Bearer NtID0sIuGBNCcZkU1pK1q6hMB1tq0t1Uofs8mTa8ac6HLrBm83ZvmV6X7lHQYoH2u8HkCAgke-7Y8tQr_dn8hpXgZMIrVto06mv8d9mARrr02FqrnU5OQywRbrx3YHYx'
  }
};
  console.log('请求到了')


axios(config)
.then(function (response) {
  //const data = response.data;
  console.log(JSON.stringify(response.data,null,4));
  res.json(response.data.businesses);
})
.catch(function (error) {
  console.log(error);
});

})





//Initial DB
const db = require("./app/models");
const Role = db.role;

//todo:force used for dev mode only.
db.sequelize.sync();
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Db');
//   initial();
// });

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 2,
    name: "admin"
  });
}

//AuthN tests
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/query.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
