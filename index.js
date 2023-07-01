const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance
const os = require("os");
const PORT = 4000;

console.clear(); // clear the console to remove previous logging

// app.use(express.static(__dirname));

// Logs time for every request
// function requestTime(req, res, next) {
//     process.stdout.write(`Request-Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} IST, ${req.method} ${req.url} \n`);
//     next();
// }
// app.use(requestTime); // logs request time
// app.use(bodyParser.json()); // used to parse the request and extract the information
// app.use(bodyParser.urlencoded({ extended: false }));

// for testing purposes
app.get("/", async (req, res) => {
  // res.sendFile(path.join(__dirname + 'index.html'));
  // const parseIp = (req) =>
  //   req.headers["x-forwarded-for"]?.split(",").shift() ||
  //   req.socket?.remoteAddress;

  // res.send(`Welcome ${parseIp(req)}, it's me ${os.hostname()}
  // with ❤️ from San Francisco, USA (West) - sfo1`);
  return res.send("Hello world");
});

// require("./routes")(app) // Initialize the route/s
// // Connect to the Database
// mongoose
//   .connect(dbConfig.DB_URL, {
//     useNewUrlParser: true, // To avoid Deprecation Warning
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log(`Pinging Google Cloud Servers...`);
//     console.log(`Ping Successful`);
//     console.log(`Connecting to Atlas GCP Mumbai (asia-south1)...`);
//     console.log(`Connection established`);
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

//Initialize the express server
module.exports = app.listen(PORT, () => {
  console.log(`Admin Application Running on PORT: ${PORT}`)
})
