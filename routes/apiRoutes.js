const router = require("express").Router();
//  Import Controllers
const registrationController = require("../controller/auth/registerController");
const loginController = require("../controller/auth/loginController");
const forgotPasswordController = require("../controller/auth/password/forgotPassword");
const dashboardController = require("../controller/dashboard/index");

// JWT Middleware -Auth
const authJwt = require("../middleware/auth");
const { resetPassword } = require("../controller/auth/password/forgotPassword");

// Registration Api
router.post("/registration", registrationController.register);

// Login Api
router.post("/login", loginController.login);

//  Forgot Password Api
router.post(
  "/forgot-password",
  authJwt.userAuth,
  forgotPasswordController.forgotPassword
);

//  Reset Password Api
router.post("/reset-password/:token", authJwt.userAuth, resetPassword);

// Update Profile Api
router.post(
  "/update-profile",
  authJwt.userAuth,
  dashboardController.updateProfile
);

// Change Password api
router.post(
  "/change-password",
  authJwt.userAuth,
  dashboardController.changePassword
);

// Logout Api
router.post("/logout", loginController.logOut);

module.exports = router;
