const express = require("express");
const mongoose = require('mongoose');
require("dotenv").config({ path: "./config.env" });
const dbURL = "mongodb+srv://dcphillips99:00805061Dp!@ratemyrestroom.tobsj.mongodb.net/RateMyRestroom?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;
//may not need
const cors = require("cors");
const app = express();


const routes = require("./routes/user")



//helps easily parse json files to help manage types and easily translate json data
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(routes);
//runs app and listens for calls/route calls
app.listen(port, () => {
  // perform a database connection when server starts
  //may need to place this in user routes?
mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
  console.log(`Server is running on port: ${port}`);
});

module.exports = app;