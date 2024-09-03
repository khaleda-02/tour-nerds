const crypto = require("crypto");
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
  passwordChangedAt: Date,
  photo: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpires: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // after trying => no need for this line, because this function will not be executed when updating, just on create & save
  // no, ti's important and should be run, ex. in case createResetPasswordToken we update the user data but not using update fun, it's find the user and then make changes on it then save it.
  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) this.passwordChangedAt = Date.now();
  next();
});
UserSchema.methods.isPasswordChangedAfter = function (iat) {
  if (this.passwordChangedAt)
    return iat < parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  return false;
};
UserSchema.methods.createResetPasswordToken = async function () {
  // create a token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // hash the token
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // save hashed token to the user dec
  this.resetPasswordToken = hashToken;
  this.resetPasswordTokenExpires = Date.now() + 60 * 60 * 1000;
  await this.save();

  // return the resetToken to the
  return resetToken;
};

UserSchema.methods.updateUserPassword = async function (
  password,
  resetPassword,
) {
  this.password = password;
  if (resetPassword) {
    this.resetPasswordToken = undefined;
    this.resetPasswordTokenExpires = undefined;
  }
  await this.save();
  // I used save here instead of findOneAndUpdate to run the pre save middleware and the validators in the schema(if it's exists)
  // so if I used findOneAndUpdate it will not run the validators
  //? so at the end don't use findOneAndUpdate in any case that related to password
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
