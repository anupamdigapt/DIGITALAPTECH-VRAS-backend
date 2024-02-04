const router = require("express").Router();
const logRegController = require("../controller/logReg.controller");
const imguploads = require("../helper/multer");

// registration api //
router.post('/registration',logRegController.register)
// login api //
router.post('/login',logRegController.login)
module.exports = router;
