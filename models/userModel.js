const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first name is required..."],
    minlength: 6,
    maxlength: 10,
  },
  lastName: {
    type: String,
    minlength: 6,
    maxlength: 10,
  },
  username: {
    type: String,
    required: [true, "username is required..."],
    unique: true,
    minlength: 3,
    maxlength: 15,
  },
  email: {
    type: String,
    required: [true, "email is required..."],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required..."],
    minlength: 6,
    maxlength: 12,
    select: false,
  },
  photo: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  // if (!this.isModified("password")) return next(); // after trying => no need for this line, because this function will not be executed when updating, just on create & save
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
