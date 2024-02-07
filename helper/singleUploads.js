const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image-uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        "vras" +
        uniqueSuffix +
        path.extname(file.originalname)
    );
  },
});
const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only jpg, jpeg, png are allowed"));
    }
  },
});
module.exports = uploads;
