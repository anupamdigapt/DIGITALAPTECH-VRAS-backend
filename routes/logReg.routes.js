const router = require("express").Router();
const logRegController = require("../controller/logReg.controller");
const imgUploads = require('../helper/multer')


// registration api //
router.post("/registration",imgUploads.single('image'),logRegController.register);
// login api //
router.post("/login", logRegController.login);
// update profile api //
// router.post('/update-profile',imgUploads.single('image'),logRegController.userAuth,logRegController.updateProfile)
// change Password api //
router.post('/change-password',logRegController.userAuth,logRegController.changePassword);
// logout api //
router.post("/logout", logRegController.logOut);

module.exports = router;
