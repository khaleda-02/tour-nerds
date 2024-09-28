const allowedTo = require("./allowedToMiddleware");
const protectRoute = require("./protectRouteMiddleware");
const errorHandler = require("./errorMiddleware");
const uploadImage = require("./uploadImage");

module.exports = { allowedTo, protectRoute, errorHandler, uploadImage };
