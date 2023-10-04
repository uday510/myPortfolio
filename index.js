const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance
const os = require("os");

// console.clear(); // clear the console to remove previous logging


// Logs time for every request
function requestTime(req, res, next) {
  process.stdout.write(`Request-Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST, ${req.method} ${req.url} \n`);
  next();
}
// TODO -> DO NOT FUCKING USE CONSOLE LOG IN VERCEL PRODUCTION
// app.use(requestTime); // logs request time
app.use(bodyParser.json()); // used to parse the request and extract the information
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  const userAgent = req.get('User-Agent');
  console.log('User-Agent:', userAgent);
  if (userAgent && userAgent.toLowerCase().includes('curl')) {
    // Request may have come from a shell
    // You can add more checks based on the User-Agent header
    return res.status(200).send('CONNECTED TO THE INTERNET\n')
  }
  next();
})

app.use(express.static(__dirname));

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
