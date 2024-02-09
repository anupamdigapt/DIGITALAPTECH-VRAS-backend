const path = require("path");
const url = require("url");

//  Multer
const multer = require("multer");

// Custom helper
const { name } = require("./custom");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/image-uploads");
  },
  filename: (req, file, cb) => {
    let fileName = name(file.fieldname);
    fileName += path.extname(url.parse(file.originalname).pathname);
    cb(null, fileName);
  },
});
const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("File Validation Error!!!"));
    }
  },
});
module.exports = uploads;
