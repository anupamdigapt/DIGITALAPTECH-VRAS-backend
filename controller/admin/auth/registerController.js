const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const {sendResponse} = require("../../helper/sendResponse");
const registerValidation = require("../../validationSchema/registervalidation");

class registerController {
  // method registration 

  async register(req, res) {
    try {
      const validationResult = registerValidation.validate(req.body);
      if (validationResult.error) {
        return sendResponse(res, 400, validationResult.error.details[0].message, []);
      }
      // if (_.isEmpty(req.body.name)) {
      //   return sendResponse(res, 400, "Name is required", []);
      // }
      // if (_.isEmpty(req.body.email)) {
      //   return sendResponse(res, 400, "Email is required", []);
      // }
      // if (_.isEmpty(req.body.mobileno)) {
      //   return sendResponse(res, 400, "mobileNo is required", []);
      // }
      // if (_.isEmpty(req.body.password)) {
      //   return sendResponse(res, 400, "password is required", []);
      // }
      // if (_.isEmpty(req.body.confirm_password)) {
      //   return sendResponse(res, 400, "confirmPassword is required", []);
      // }
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
      if (!req.file || !req.file.filename) {
        return sendResponse(res, 400, "Image is required", []);
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
        image: req.file.filename
      });
      if (!_.isEmpty(saveData) && saveData._id) {
        const emailData = {
          name: saveData.name
        };
        // await mailer.sendMail(
        //   process.env.EMAIL,
        //   saveData.email,
        //   "email submitted",
        //   `hiw ${saveData.name} your Registration has sucessfully done`
        // );
        await mailer.sendMail(
          process.env.EMAIL,
          saveData.email,
          "Registration Confirmation",
          "registrationConfirmation.ejs",
          emailData 
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
