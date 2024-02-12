const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const {sendResponse} = require("../../helper/sendResponse");
class dashboardController {
  //   method update password //

  async changePassword(req, res) {
    try {
      const loginUser = await userModel.findOne({ _id: req.user.id });
      console.log("login user", loginUser);

      if (req.body.newPassword === req.body.oldPassword) {
        res.json({
          status: 400,
          message: "New Password cannot be same as Old Password",
        });
      }

      if (bcrypt.compareSync(req.body.oldPassword, loginUser.password)) {
        if (req.body.newPassword != req.body.confirmPassword) {
          res.json({
            status: 200,
            message: "password not matching ",
          });
        }
   
        let newPassword = req.body.newPassword;
        console.log("new password", newPassword);
        req.body.newPassword = bcrypt.hashSync(
          req.body.newPassword,
          bcrypt.genSaltSync(10)
        );
        let updated_obj = {
          password: req.body.newPassword,
        };
        console.log(loginUser.password, "OLD");
        console.log(req.body.newPassword, "NEW");
        let update_data = await userModel.findByIdAndUpdate(
          req.user.id,
          updated_obj
        );
        if (!_.isEmpty(update_data)) {
          res.json({
            status: 200,
            message: "password Updated Sucessfully!!!",
          });
        } else {
          res.json({
            status: 400,
            message: "There was some error. Please try again",
          });
        }
      } else {
        res.json({
          status: 400,
          message: "old password is wrong",
        });
      }
    } catch (err) {
      throw err;
    }
  }

  //  method update profile // 
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

      if (req.file) {
        loginUser.image = req.file.filename;
      }
      const updatedUser = await loginUser.save();
      res.json({
        status: 200,
        message: "Profile updated successfully !!!",
        data: updatedUser,
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new dashboardController();
