import { registerRootComponent } from 'expo';
import App from './src/App';

require("dotenv").config({ path: "./config.env" });
const express = require("express")
const mongoose = require("mongoose")
const createServer = require("./server")
const dbURL = "mongodb+srv://dcphillips99:00805061Dp!@ratemyrestroom.tobsj.mongodb.net/RateMyRestroom?retryWrites=true&w=majority";
const port = process.env.PORT || 5000;

mongoose
	.connect(dbURL, { useNewUrlParser: true })
	.then(() => {
		const app = createServer() // new
		app.listen(port, () => {
			console.log(`Server has started on port: ${port}`)
		})
	})
 
registerRootComponent(App);
