const { Router } = require("express");
const { authController } = require("../controllers");
const protectRoute = require("../middlewares/protectRouteMiddleware");

const router = Router();

router
  .post("/signup", authController.signup)
  .post("/signin", authController.signin)
  .post("/forgot-password", authController.forgotPassword)
  .patch("/reset-password/:token", authController.resetPassword)
  .put("/update-password", protectRoute, authController.updatePassword);

module.exports = router;
