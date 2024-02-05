const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const {sendResponse} = require("../../helper/sendResponse");

class registerController {
  // method registration //

  async register(req, res) {
    try {
      if (_.isEmpty(req.body.name)) {
        return sendResponse(res, 400, "Name is required", []);
      }
      if (_.isEmpty(req.body.email)) {
        return sendResponse(res, 400, "Email is required", []);
      }
      if (_.isEmpty(req.body.mobileno)) {
        return sendResponse(res, 400, "mobileNo is required", []);
      }
      if (_.isEmpty(req.body.password)) {
        return sendResponse(res, 400, "password is required", []);
      }
      if (_.isEmpty(req.body.confirm_password)) {
        return sendResponse(res, 400, "confirmPassword is required", []);
      }
      let isEmailExist = await userModel.findOne({ email: req.body.email });
      if (!_.isEmpty(isEmailExist)) {
        return sendResponse(res, 400, "this email is already exist", []);
      }
      if (req.body.password !== req.body.confirm_password) {
        return sendResponse(
          res,
          400,
          "password and confirmPassword are does not matching",
          []
        );
      }
      req.body.image = req.file.filename;
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let saveData = await userModel.create(req.body);
      if (!_.isEmpty(saveData) && saveData._id) {
        await mailer.sendMail(
          process.env.EMAIL,
          saveData.email,
          "email submitted",
          `hiw ${saveData.name} your Registration has sucessfully done`
        );
        return sendResponse(
          res,
          200,
          "Your Registartion has been sucessfully completed !!!",
          saveData
        );
      } else {
        return sendResponse(res, 400, "Something Went Wrong", []);
      }
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new registerController();