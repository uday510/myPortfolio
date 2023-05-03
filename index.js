const express = require("express");
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance

console.clear(); // clear the console to remove previous logging

app.use(bodyParser.json()); // used to parse the request and extract the information
app.use(bodyParser.urlencoded({ extended: true }));

// for testing purposes
app.get("/", (req, res) => {
  res.send(
    `Request-Date: ${new Date().toString()} ${req.method} ${req.url} ${
      req.socket.remoteAddress
    }\n`
  );
});

// Connect to the Database
mongoose
  .connect(dbConfig.DB_URL, {
    useNewUrlParser: true, // To avoid Deprecation Warning
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Pinging Google Cloud Servers...`);
    console.log(`Ping Successful`);
    console.log(`Connecting to Atlas GCP Mumbai (asia-south1)...`);
    console.log(`Connection established`);
  })
  .catch((err) => {
    console.log(err.message);
  });

//Initialize the express server
module.exports = app.listen((serverConfig.HOST, serverConfig.PORT), () => {
  console.log(
    `Admin Application Running on PORT: ${serverConfig.PORT}`
  );
});
