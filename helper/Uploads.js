const multer = require("multer");
const path = require("path");
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: "./public/image-uploads",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(8).toString('hex');
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const uploads = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only image files are allowed"));
    }
  },
});

module.exports = uploads;
