const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const { sendResponse } = require("../../helper/sendResponse");
class dashboardController {
  // Method Update Password
  async changePassword(req, res) {
    try {
      const loginUser = await userModel.findOne({ _id: req.user.id });

      if (req.body.newPassword === req.body.oldPassword) {
        return sendResponse(res,400,"New Password cannot be same as Old Password",[])
      }

      if (!bcrypt.compareSync(req.body.oldPassword, loginUser.password)) {
        return sendResponse(res,400,"Old Password is Wrong !!!",[])
      }

      if (req.body.newPassword !== req.body.confirmPassword) {
        return sendResponse(res,400,"password do not match",[])
      }

      const newPasswordHash = bcrypt.hashSync(
        req.body.newPassword,
        bcrypt.genSaltSync(10)
      );
      const updatedUser = await userModel.findByIdAndUpdate(req.user.id, {
        password: newPasswordHash,
      });

      if (updatedUser) {
        return sendResponse(res,200,"Password Updated Sucessfully !!!",[])
      } else {
        return sendResponse(res,400,"There was an error, Plz Try again...",[])
      }
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }

  //  Method Update Profile
  async updateProfile(req, res) {
    try {
      const loginUser = await userModel.findOne({ _id: req.user.id });
      console.log("login user", loginUser);
      if (_.isEmpty(loginUser)) {
        return sendResponse(res,400,"User Not Found !11",[])
      }

      if (!_.isEmpty(req.body.name)) {
        loginUser.name = req.body.name;
      }

      if (!_.isEmpty(req.body.mobileno)) {
        loginUser.mobileno = req.body.mobileno;
      }
      const updatedUser = await loginUser.save();
      return sendResponse(res,400,"profile Updated Sucessfully !!!",updatedUser)
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}
module.exports = new dashboardController();
