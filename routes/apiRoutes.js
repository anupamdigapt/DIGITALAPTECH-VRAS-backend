const router = require("express").Router();
const registrationController = require("../controller/auth/registerController");
const loginController = require('../controller/auth/loginController')
const forgotPasswordController = require("../controller/auth/password/forgotPassword")
const dashboardController  = require('../controller/dashboard/index')
const imgUploads = require('../helper/singleUploads')
// const { userAuth } = require('../helper/authGuard');

// registration api
router.post("/registration",imgUploads.single('image'),registrationController.register);
// login api
router.post("/login", loginController.login);
//  forgot Password api 
router.post("/forgot-password", forgotPasswordController.userAuth, forgotPasswordController.forgotPassword)
//  Reset Password api
router.post("/reset-password/:token", forgotPasswordController.userAuth, forgotPasswordController.resetPassword)
// update profile api
router.post('/update-profile', imgUploads.single('image'), dashboardController.userAuth,dashboardController.updateProfile)
// change Password api
router.post('/change-password',dashboardController.userAuth,dashboardController.changePassword);
// logout api 
router.post("/logout", loginController.logOut);

module.exports = router;
