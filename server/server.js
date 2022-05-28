const express = require("express");
const routes = require("./routes/user");
const cors = require("cors");

function createServer() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded());
	app.use(routes);
	app.use(cors);
	return app;
}

module.exports = createServer;
