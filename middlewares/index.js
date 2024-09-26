const allowedTo = require("./allowedToMiddleware");
const protectRoute = require("./protectRouteMiddleware");
const errorHandler = require("./errorMiddleware");

module.exports = { allowedTo, protectRoute, errorHandler };
