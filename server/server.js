const express = require("express");
const mongoose = require('mongoose');
const dbURL = process.env.ATLAS_URI;
const port = process.env.PORT || 5000;
//may not need
const cors = require("cors");

const app = express();

require("dotenv").config({ path: "./config.env" });

//helps easily parse json files to help manage types and easily translate json data
//app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

//runs app and listens for calls/route calls
app.listen(port, () => {
  // perform a database connection when server starts
  //may need to place this in user routes?
mongoose.connect(dbURL || 'mongodb://localhost:5000/bad-server-connection', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
  console.log(`Server is running on port: ${port}`);
});