const express = require("express");
require("dotenv").config();

const app = express();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorMiddleware");

connectDb();
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/tour", require("./routes/tourRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use(errorHandler);
// Not found reqs
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: "request not found!!",
  });
});

app.listen(3000, () => {
  console.log("app is running on 300");
});
