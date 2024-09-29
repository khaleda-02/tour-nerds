const multer = require("multer");

// uploading configuration
const userMulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/users");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `user-${req.user.id}-${Date.now()}.${file.mimetype.split("/")[1]}`,
    );
  },
});

const tourMulterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/tours");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `tour-${req.user.id}-${Date.now()}.${file.mimetype.split("/")[1]}`,
    );
  },
});

const multerFilter = (req, file, cb) => {
  const fileExt = file.mimetype.split("/")[0];
  if (fileExt != "image") cb(new Error("please upload an image!!"), false);
  cb(null, true);
};

// multer setup
const userUpload = multer({
  storage: userMulterStorage,
  fileFilter: multerFilter,
});
const tourUpload = multer({
  storage: tourMulterStorage,
  fileFilter: multerFilter,
});

// uploading functions
const uploadUserImage = userUpload.single("photo");
const uploadTourImages = tourUpload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

// exporting
module.exports = {
  uploadUserImage,
  uploadTourImages,
};