const errorHandler = (err, req, res, next) => {
  const codeStatus = res.statusCode || 500;

  res.statusCode = codeStatus;

  if (process.env.NODE_ENV == "development") {
    res.json({ status: "Failed", message: err.message, stack: err.stack });
  } else {
    if (err.name == "CastError") {
      res.status(400);
      err.message = `invalid ${err.path}: ${err.value}`;
    }

    // handling duplicated doc error: when trying to create a doc with an excited name for example.
    if (err.code == 11000) {
      res.status(400);
      const fieldName = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      err.message = `Duplicated field value: ${fieldName}, please use another value`;
    }

    // handling validator errors
    if (err.name == "ValidationError") {
      res.status(400);
      const errors = Object.values(err.errors).map((el) => el.message);
      err.message = `invalid input data. ${errors.join(" ")}`;
    }
    res.json({ status: "Failed", message: err.message });
  }
};

// Helper Functions
const castErrorHandler = (error) => {
  const message = `invalid ${error.path}: ${error.value}`;
  // throw new
};
module.exports = errorHandler;
