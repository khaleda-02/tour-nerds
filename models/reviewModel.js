const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const Tour = require("./tourModel");

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "review must belong to a user"],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "review must belong to a tour"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// preventing duplicated review
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//  Model static functions runs on the model it's self not on the instance (this -> return to the model)
ReviewSchema.statics.calcRating = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAvg: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAvg: 4.5,
      ratingsQuantity: 0,
    });
};

// update the rating data of the tour when creating new review.
ReviewSchema.post("save", function () {
  this.constructor.calcRating(this.tour);
});

// update the rating data of the tour when updating and deleting review.
ReviewSchema.post(/^findOneAnd/, async function (docs, next) {
  if (docs) docs.constructor.calcRating(docs.tour);
  next();
});

// populate the user data when queuing the review
ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "username",
  });
  next();
});
const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
