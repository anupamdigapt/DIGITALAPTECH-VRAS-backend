const router = require("express").Router();
const regController = require("../controller/auth/registerController");
const loginController = require('../controller/auth/loginController')
const resetPasswordController = require('../controller/auth/password/resetPassword')
const dashboardController  = require('../controller/dashboard/index')
const imgUploads = require('../helper/singleUploads')


// registration api //
router.post("/registration",imgUploads.single('image'),regController.register);
// // login api //
router.post("/login", loginController.login);
// // update profile api //
router.post('/update-profile',imgUploads.single('image'),dashboardController.userAuth,dashboardController.updateProfile)
// // change Password api //
router.post('/change-password',dashboardController.userAuth,dashboardController.changePassword);
// // logout api //
router.post("/logout", loginController.logOut);

module.exports = router;
