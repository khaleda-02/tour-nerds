const allowedTo = (...roles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!roles.includes(user.role)) {
      res.status(403);
      throw new Error("unauthorized user to perform this action !!!");
    }
    next();
  };
};

module.exports = allowedTo;
