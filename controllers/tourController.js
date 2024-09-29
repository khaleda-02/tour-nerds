const { Tour } = require("../models");
const asyncHandler = require("express-async-handler");

//todo: add validation on createTour.

// @des    create tour
// @route  POST /api/tour/
// @access public
const createTour = asyncHandler(async (req, res) => {
  const body = req.body;
  const tour = await Tour.create(body);

  if (!tour) throw new Error("something went wrong when creating new Tour!!!");

  res.status(201).json({
    status: "success",
    data: tour,
  });
});

// @des      get all tours
// @route  GET /api/tours/
// @access public
/*
 * docs
 * filtering => put any thing in the query, and when gte,gt,lte,lt wanted -> duration[operation]
 * sorting  => add sort into the query,
 *                   ascending sorting   => sort=price
 *                   descending sorting  => sort=-price
 *                   to add sec criteria    => sort=price,duration
 **/
const getAllTours = asyncHandler(async (req, res) => {
  // filtering
  let { page, limit, sort, ...queryObj } = req.query;
  const queryStr = JSON.stringify(queryObj);
  queryObj = JSON.parse(
    queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (opt) => `$${opt}`),
  );

  // build query
  let query = Tour.find(queryObj);

  // sorting
  if (sort) {
    const sortBy = sort.split(",").join("  ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination
  page = page * 1 || 1;
  limit = limit * 1 || 5;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // execute query
  const tours = await query;

  if (!tours) throw new Error("there is no tours founded!!");
  res.status(200).json({
    status: "success",
    data: tours,
  });
});

// @des    get tour
// @route  GET /api/tour/:id
// @access private
const getTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
    res.status(404);
    // throw new Error("no tour with this id!!");
    throw new Error("no tour with this id!!");
  }

  res.status(200).json({
    status: "success",
    data: tour,
  });
});

// @des    update tour
// @route  PUT /api/tour/:id
// @access private
const updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  // update images & coverImage in db after uploaded
  if (req.files.coverImage && req.files.images) {
    body.coverImage = req.files.coverImage[0].filename;
    body.images = [];
    req.files.images.forEach((img) => {
      body.images.push(img.filename);
    });
  }
  const updatedTour = await Tour.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    res.status(404);
    throw new Error(
      "tour not found OR something went wrong while updating the tour!!",
    );
  }
  res.status(200).json({
    status: "success",
    data: { updatedTour },
  });
});

// @des    delete tour
// @route  DELETE /api/tour/:id
// @access private
const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedTour = await Tour.findByIdAndDelete(id);

  if (!deletedTour) {
    res.status(404);
    throw new Error(
      "tour not found OR something went wrong while deleing the tour!!",
    );
  }
  res.status(200).json({
    status: "success",
    data: null,
  });
});

module.exports = {
  createTour,
  getAllTours,
  getTour,
  updateTour,
  deleteTour,
};
