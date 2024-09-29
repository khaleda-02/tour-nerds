const { Router } = require("express");
const { tourController, reviewController } = require("../controllers");
const protectRoute = require("../middlewares/protectRouteMiddleware");
const allowedTo = require("../middlewares/allowedToMiddleware");
const {
  uploadTourImages,
} = require("../middlewares/uploadImage");
const router = Router();

router
  .route("/")
  .post(
    protectRoute,
    allowedTo("admin", "lead-guide"),
    tourController.createTour,
  )
  .get(protectRoute, tourController.getAllTours);

router
  .route("/:id")
  .get(tourController.getTour)
  .put(
    protectRoute,
    allowedTo("admin", "lead-guide"),
    uploadTourImages,
    tourController.updateTour,
  )
  .delete(
    protectRoute,
    allowedTo("admin", "lead-guide"),
    tourController.deleteTour,
  );

// tour's review routes:
router
  .route("/:tourId/review")
  .post(protectRoute, allowedTo("user"), reviewController.createReview)
  .get(reviewController.getTourReviews);

router.get("/:tourId/review/:reviewId", reviewController.getTourReview);

module.exports = router;
// getAllTours
// getTour
// createTour
// updateTour
// deleteTour
