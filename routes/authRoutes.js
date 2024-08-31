const { Router } = require("express");
const { authController } = require("../controllers");

const router = Router();

router
  .post("/signup", authController.signup)
  .post("/signin", authController.signin)
  .post("/reset-password", authController.resetPassword)
  .put("/update-user", authController.updateUser);

module.exports = router;
