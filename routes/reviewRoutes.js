const { Router } = require("express");
const { reviewController } = require("../controllers");
const protectRoute = require("../middlewares/protectRouteMiddleware");
const allowedTo = require("../middlewares/allowedToMiddleware");
const router = Router();

// routes
// creating & getting reviews routes in tourRoutes.js file.
// create -> POST api/tours/:tourId/review
// getTourReviews ->GET  api/tours/:tourId/review
// delete -> DELETE  api/review/:id
router.delete(
  "/:id",
  protectRoute,
  allowedTo("user", "admin"),
  reviewController.deleteReview,
);

module.exports = router;
