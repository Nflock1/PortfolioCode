const express = require("express");
const routes = require("./routes/user")
const axios = require("axios")

function createServer() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(routes);
  return app
}

module.exports = createServer;