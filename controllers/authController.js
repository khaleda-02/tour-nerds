const crypto = require("crypto");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const sendEmail = require("../util/sendEmail.js");

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

// @des    signin
// @route  POST /api/auth/signin
// @access public
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

// @des    forgot password=> send the email to get the reset token via the email.
// @route  POST /api/auth/forgot-password
// @access public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // get the user email
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("user not found !!");
  }

  // create a token for the user ( and because it related to user and manipulate user's data, we should do it in the user model )
  const resetToken = await user.createResetPasswordToken();

  // send it to the user's email
  const mailOptions = {
    to: user.email,
    subject: "Rest Your Password using this Email (Valid for 1 Hour) ",
    text: resetToken,
  };

  // I put the tyr/catch block here instead of put it in the sendEmail fun to get access to the res object so I can return 400 res in error case.
  try {
    await sendEmail(mailOptions);
  } catch (err) {
    res.status(400);
    throw new Error(
      "something went wrong when sending the email, please try again !!",
    );
  }
  res.status(200).json({
    status: "success",
  });
});

// @des    reset password => by clicking the token (that sent to user's email) this route called and getting the token from the params, then change the password based on the token if it's correct.
// @route  PATCH /api/auth/reset-password/:token
// @access public
const resetPassword = asyncHandler(async (req, res) => {
  const { password, passwordConfirm } = req.body;
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // get the user based on the token & verify it
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(401);
    throw new Error(
      "invalid token, there's no user associated with this token!!",
    );
  }

  // update the user password  passwordChangedAt
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("the passwordConfirm must be as same as the password!!! ");
  }
  await user.updateUserPassword(password, true);

  // log the user in
  const token = createToken(user._id);

  res.status(201).json({
    status: "success",
    data: { token },
  });
});

// @des    update-password
// @route  PUT /api/auth/update-password
// @access Protect
const updatePassword = asyncHandler(async (req, res) => {
  // get the user data
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!currentPassword || !password || !passwordConfirm) {
    res.status(400);
    throw new Error("add credentials ");
  }
  // ensure that user's old password is correct
  const user = await User.findById(req.user.id).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    res.status(400);
    throw new Error("incorrect password !!");
  }

  // update the user's password after ensuring the password is valid.
  if (password !== passwordConfirm) {
    res.status(400);
    throw new Error("the passwordConfirm must be as same as the password!!! ");
  }

  await user.updateUserPassword(password, false);

  res.status(201).json({
    status: "success",
    data: "password updated successfully ",
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
  signin,
  forgotPassword,
  resetPassword,
  updatePassword,
};
