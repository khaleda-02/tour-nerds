const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = asyncHandler(async (req, res, next) => {
  // get the token
  let token;
  let header = req.headers.authorization;
  if (header && header.startsWith("Bearer")) {
    token = header.split(" ")[1];
  }
  if (!token) {
    res.status(401);
    throw new Error("unauthorized , missing token");
  }

  // verity the token
  const { id, iat } = await jwt.verify(token, process.env.JWT_SECRET);

  // ensure that the user is exists
  const user = await User.findById(id);
  if (!user) {
    res.status(401);
    throw new Error("user is no longer exists");
  }

  // ensure that the user didn't change his password
  const isPasswordChangedAfter = user.isPasswordChangedAfter(iat);
  if (isPasswordChangedAfter) {
    res.status(401);
    throw new Error("user changed his password, please login again");
  }

  req.user = user;
  next();
});

module.exports = protectRoute;
