const { Router } = require("express");
const { tourController } = require("../controllers");
const protectRoute = require("../middlewares/protectRouteMiddleware");
const allowedTo = require("../middlewares/allowedToMiddleware");
const router = Router();

router
  .route("/")
  .post(tourController.createTour)
  .get(protectRoute, allowedTo("admin"), tourController.getAllTours);
router
  .route("/:id")
  .get(tourController.getTour)
  .put(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
// getAllTours
// getTour
// createTour
// updateTour
// deleteTour
