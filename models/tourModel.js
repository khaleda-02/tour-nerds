const { required } = require("joi");
const mongoose = require("mongoose");
// slugify, validator

const TourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      maxlength: 40,
      minlength: 10,
    },
    ratingsAvg: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "difficulty must be within: easy, medium or difficult",
      },
    },
    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    images: [String],
    startDates: [Date],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startLocation: {
      type: {
        type: String,
        default: "point",
        enum: ["point"],
      },
      coordinate: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: "point", enum: ["point"] },
        coordinate: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // referencing Tour guide
    guides: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  {
    // the sec para is the schema opt, and when we need to add virtual prop we need to add this
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//? Virtual prop
// return this.relatedProp * 12;
//ex:
TourSchema.virtual("weeklyTours").get(function () {
  return this.duration / 7;
});

//? Document Middleware
// run on save, create hooks,
TourSchema.pre("save", function (next) {
  // we have access to the object that will be created after this function.
  // ex: add slug into the doc
  // this.slug = slugify(this.name, { lower: true });
  next();
});

TourSchema.post("save", function (doc, next) {
  // so here we don't have access to this, but we have the created doc
  next();
});

// ? Query Middleware
//  run on find hook and we will have access to the query obj, not the doc
TourSchema.pre(/^find/, function (next) {
  // to run on find, findOne, findById...
  // TourSchema.pre('find',function(next){
  // this.find(add new conditions);
  // and we can add props to the query
  // this.example = "example";

  // using populate to get the user actual data instead of the Ids
  this.populate({
    path: "guides",
    select: "name role email",
  });
  next();
});

TourSchema.post(/^find/, function (docs, next) {
  // we have access to all returned docs
  next();
});
const Tour = mongoose.model("Tour", TourSchema);
module.exports = Tour;
