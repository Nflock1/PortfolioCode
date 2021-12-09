const express = require("express");
const routes = require("./routes/user")

require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose")
const createServer = require("./server")
const dbURL = "mongodb+srv://dcphillips99:00805061Dp!@ratemyrestroom.tobsj.mongodb.net/RateMyRestroom?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;
 
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(routes);
 
  mongoose
	.connect(dbURL, { useNewUrlParser: true })
	.then(() => {
		app.listen(port, () => {
			console.log(`Server has started on port: ${port}`)
		})
	})
module.exports = app;