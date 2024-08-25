const { Router } = require("express");
const { tourController } = require("../controllers");
const router = Router();

router
  .route("/")
  .post(tourController.createTour)
  .get(tourController.getAllTours);
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
