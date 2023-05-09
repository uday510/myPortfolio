const express = require("express");
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance
const axios = require("axios");
const os = require("os");

console.clear(); // clear the console to remove previous logging

// Logs time for every request
function requestTime(req, res, next) {
    process.stdout.write(`Request-Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST, ${req.method} ${req.url} \n`);
    next();
}
app.use(requestTime); // logs request time
app.use(bodyParser.json()); // used to parse the request and extract the information
app.use(bodyParser.urlencoded({ extended: true }));

// for testing purposes
app.get("/", async (req, res) => {
  const ip = await axios.get("https://checkip.amazonaws.com/");
  res.send(`Welcome ${ip.data}, it's me ${os.hostname()} with ❤️ from San Francisco, USA (West) - sfo1`);
});

require("./routes")(app) // Initialize the route/s
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
