const asyncHandler = require("express-async-handler");
const { Review } = require("../models");

// @des    createReview
// @route  POST /api/tour/tourId/reviews
// @access public
const createReview = asyncHandler(async (req, res) => {
  const { review, rating } = req.body;
  const user = req.user;
  const { tourId: tour } = req.params;

  // this code for preventing duplicated review, but I used the index instead
  // const reviewExists = await Review.findOne({ tour, user: user.id });
  // if (reviewExists) {
  //   res.status = 400;
  //   throw new Error("you can't review a tour more than once!!");
  // }
  const createdReview = await Review.create({
    review,
    rating,
    user: user.id,
    tour,
  });

  if (!createdReview) {
    res.status(400);
    throw new Error("something went wrong, please try again!");
  }
  res.status(201).json({
    status: "success",
    data: createdReview,
  });
});

const getTourReviews = asyncHandler(async (req, res) => {
  const { tourId: tour } = req.params;
  const tourReviews = await Review.find({ tour });
  res.status(200).json({
    status: "success",
    data: tourReviews,
  });
});

const getTourReview = asyncHandler(async (req, res) => {
  const { reviewId: id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    res.status(404);
    throw new Error("review not found OR something went wrong !!");
  }
  res.status(200).json({
    status: "success",
    data: review,
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  let deletedReview;
  if (user.role == "admin") {
    deletedReview = await Review.findByIdAndDelete(id);
  } else {
    deletedReview = await Review.findOneAndDelete({
      _id: id,
      user: { _id: user.id },
    });
  }

  if (!deletedReview) {
    res.status(404);
    throw new Error(
      "something went wrong, either the review not found OR not associated with this user!!",
    );
  }
  res.status(200).json({
    status: "success",
  });
});

module.exports = {
  createReview,
  getTourReviews,
  getTourReview,
  deleteReview,
};
