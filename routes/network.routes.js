const networkController = require('../controllers/network.controller');

module.exports = (app) => {
    app.get("/", networkController.checkInternetStatus);
}