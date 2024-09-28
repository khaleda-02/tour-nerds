const asyncHandler = require("express-async-handler");
const { User } = require("../models");

const getMe = asyncHandler(async (req, res) => {
  console.log(req.user, "user");
  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

const updateMe = asyncHandler(async (req, res) => {
  if (req.body.password || req.body.role || req.body.email) {
    res.status(400);
    throw new Error(`you can't change: password, email or role`);
  }

  const filteredBody = filterBody(
    req.body,
    "firstName",
    "lastName",
    "username",
    "photo",
  );

  // adding the file name into the user's photo prop
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({ status: "successful" });
});

//? HELPER FUNCS
const filterBody = (body, ...allowedProps) => {
  const filteredBody = {};
  Object.keys(body).forEach((el) => {
    if (allowedProps.includes(el)) filteredBody[el] = body[el];
  });
  return filteredBody;
};

module.exports = {
  getMe,
  updateMe,
  deleteMe,
};
