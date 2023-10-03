const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance
const os = require("os");
const networkRoutes = require("./controllers/network.controller");


console.clear(); // clear the console to remove previous logging

app.use(express.static(__dirname));

// Logs time for every request
function requestTime(req, res, next) {
  process.stdout.write(`Request-Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST, ${req.method} ${req.url} \n`);
  next();
}
// TODO -> DO NOT FUCKING USE CONSOLE LOG IN VERCEL PRODUCTION
// app.use(requestTime); // logs request time
app.use(bodyParser.json()); // used to parse the request and extract the information
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res) => {
  const host = req.headers.host;
  if (host === 'ping.udayteja.com') {
    return networkRoutes(req, res);
  }
});
require("./routes")(app) // Initialize the route/s

app.use((req, res, next) => {
  res.status(404).send('<h4>Page not found</h4>');
});

// Connect to the Database
mongoose
  .connect(dbConfig.DB_URL, {
    useNewUrlParser: true, // To avoid Deprecation Warning
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    throw err;
  });
