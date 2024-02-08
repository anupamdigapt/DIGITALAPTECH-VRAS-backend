const router = require("express").Router();
const registrationController = require("../controller/auth/registerController");
const loginController = require('../controller/auth/loginController')
const forgotPasswordController = require("../controller/auth/password/forgotPassword")
const dashboardController  = require('../controller/dashboard/index')
const imgUploads = require('../helper/singleUploads')
const authJwt = require('../middleware/auth')

// registration api
router.post("/registration",imgUploads.single('image'),registrationController.register);
// login api
router.post("/login", loginController.login);
//  forgot Password api 
router.post("/forgot-password", authJwt.userAuth, forgotPasswordController.forgotPassword)
//  Reset Password api
router.post("/reset-password/:token", authJwt.userAuth, forgotPasswordController.resetPassword)
// update profile api
router.post('/update-profile', authJwt.userAuth, imgUploads.single('image'),dashboardController.updateProfile)
// change Password api
router.post('/change-password', authJwt.userAuth, dashboardController.changePassword);
// logout api 
router.post("/logout", loginController.logOut);

module.exports = router;
