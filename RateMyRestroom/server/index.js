const mongoose = require("mongoose")
const createServer = require("./server")
const dbURL = "mongodb+srv://dcphillips99:00805061Dp!@ratemyrestroom.tobsj.mongodb.net/RateMyRestroom?retryWrites=true&w=majority";
//require("dotenv").config({ path: "./config.env" });
const port = 5000;
const app = createServer()
const getIP = require('./connect')
getIP()
	
mongoose
	.connect(dbURL, { useNewUrlParser: true })
	.then(() => {
		app.listen(port, () => {
			console.log(`Server has started on port: ${port}`)
		})
	})


module.exports = app