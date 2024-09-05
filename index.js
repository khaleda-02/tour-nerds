const express = require("express");
require("dotenv").config();

const app = express();
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middlewares/errorMiddleware");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// Db connect
connectDb();

// set security http headers
app.use(helmet());

// enable requests limiter
app.use(
  "/api",
  rateLimit({
    max: 100,
    windowMs: 60 * 60 * 100,
    message: "too many requests, try after hour",
  }),
);

// body parser
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

// Data Sanitization => secure request body against query injection
app.use(mongoSanitize());

// clean the params objs, prevent params pollution
app.use(
  hpp({
    whitelist: ["duration"],
  }),
);

// cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use("/api/tour", require("./routes/tourRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
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
