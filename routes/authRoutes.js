const { Router } = require("express");
const { authController } = require("../controllers");

const router = Router();

router
  .post("/signup", authController.signup)
  .post("/signin", authController.signin)
  .post("/forgot-password", authController.forgotPassword)
  .patch("/reset-password/:token", authController.resetPassword)
  .put("/update-user", authController.updateUser);

module.exports = router;
    