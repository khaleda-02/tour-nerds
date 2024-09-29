const { Router } = require("express");
const { userController } = require("../controllers");
const protectRoute = require("../middlewares/protectRouteMiddleware");
const { uploadUserImage } = require("../middlewares/uploadImage");

const router = Router();

router
  .get("/me", protectRoute, userController.getMe)
  .put("/updateme", protectRoute, uploadUserImage, userController.updateMe)
  .delete("/deleteme", protectRoute, userController.deleteMe);

module.exports = router;
