const multer = require("multer");

const multerStorage = multer.diskStorage({
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

const multerFilter = (req, file, cb) => {
  const fileExt = file.mimetype.split("/")[0];
  if (fileExt != "image") cb(new Error("please upload an image!!"), false);
  cb(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

module.exports = upload.single("photo");
