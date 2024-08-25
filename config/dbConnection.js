const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const connectDb = asyncHandler(async () => {
  const connect = await mongoose.connect(process.env.DATA_BASE_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("connection done ", connect.connection.name);
  return connect;
});

module.exports = connectDb;
