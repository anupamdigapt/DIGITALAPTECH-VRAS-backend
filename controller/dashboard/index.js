const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const { sendResponse } = require("../../helper/sendResponse");
class dashboardController {
  // method update password

  async changePassword(req, res) {
    try {
      const loginUser = await userModel.findOne({ _id: req.user.id });

      if (req.body.newPassword === req.body.oldPassword) {
        return res.status(400).json({
          message: "New Password cannot be same as Old Password",
        });
      }

      if (!bcrypt.compareSync(req.body.oldPassword, loginUser.password)) {
        return res.status(400).json({
          message: "Old password is wrong",
        });
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
        });
      }

      const newPasswordHash = bcrypt.hashSync(
        req.body.newPassword,
        bcrypt.genSaltSync(10)
      );

      const updatedUser = await userModel.findByIdAndUpdate(req.user.id, {
        password: newPasswordHash,
      });

      if (updatedUser) {
        return res.status(200).json({
          message: "Password updated successfully",
        });
      } else {
        return res.status(400).json({
          message: "There was an error. Please try again.",
        });
      }
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  //  method update profile
  async updateProfile(req, res) {
    try {
      const loginUser = await userModel.findOne({ _id: req.user.id });
      console.log("login user", loginUser);
      if (_.isEmpty(loginUser)) {
        return res.json({
          status: 400,
          message: "User not found",
          data: [],
        });
      }

      if (!_.isEmpty(req.body.name)) {
        loginUser.name = req.body.name;
      }

      if (!_.isEmpty(req.body.mobileno)) {
        loginUser.mobileno = req.body.mobileno;
      }
      const updatedUser = await loginUser.save();
      res.json({
        status: 200,
        message: "Profile updated successfully !!!",
        data: updatedUser,
      });
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}
module.exports = new dashboardController();
