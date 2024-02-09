const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const { sendResponse } = require("../../helper/sendResponse");
const { registerValidation } = require("../../validationSchema/index");

class registerController {
  // method registration

  async register(req, res) {
    try {
      const validationResult = registerValidation.validate(req.body);
      if (validationResult.error) {
        return sendResponse(res,400,validationResult.error.details[0].message,[])
      }
      let isEmailExist = await userModel.findOne({ email: req.body.email });
      if (!_.isEmpty(isEmailExist)) {
        return sendResponse(res, 400, "this email is already exist", []);
      }
      if (req.body.password !== req.body.confirm_password) {
        return sendResponse(res,400,"password and confirmPassword are does not matching",[])
      }
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let saveData = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        mobileno: req.body.mobileno,
        password: req.body.password,
      });
      if (!_.isEmpty(saveData) && saveData._id) {
        const emailData = {
          name: saveData.name,
        };
        await mailer.sendMail(
          process.env.EMAIL,
          saveData.email,
          "Registration Confirmation",
          "registrationConfirmation.ejs",
          emailData
        );
        return sendResponse(res,200,"Your Registartion has been sucessfully completed !!!",saveData)
      } else {
        return sendResponse(res, 400, "Something Went Wrong", []);
      }
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}
module.exports = new registerController();
