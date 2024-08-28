const { User } = require("../models");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @des    signup
// @route  POST /api/auth/signup
// @access public
const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password, passwordConfirm } =
    req.body;

  // check if the user is already exists Or not
  const userExists = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });
  if (userExists) throw new Error("this user is already exists!!");

  // ensure that is passwordConfirm the same as the password
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("the passwordConfirm must be as same as the password!!! ");
  }

  // creating a new user
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  if (!user) throw new Error("something went wrong, please try again!");

  // create a token for valid users
  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    data: {
      token,
      username: user.username,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    },
  });
});

const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check of the email & password are exists
  if (!email || !password) {
    res.status(400);
    throw new Error("please provide credentials !!");
  }

  // check of the email & password are correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400);
    throw new Error("incorrect email or password !!");
  }

  // create a token for valid users
  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    data: { token },
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const updateUser = await User.findOneAndUpdate(
    { username: "khaledsds-02" },
    { firstName: "updated na" },
    { new: true, runValidators: true },
  );
  res.status(200).json({
    mesage: "success",
  });
});

// ? HELPER FUN
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
module.exports = {
  signup,
  updateUser,
  signin,
};
