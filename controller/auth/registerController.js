const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../helper/sendmail");
const { sendResponse } = require("../../helper/sendResponse");
const { validationResult } = require("express-validator");

class RegisterController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendResponse(res, 400, errors.array()[0].msg, []);
      }

      const { name, email, mobileno, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return sendResponse(res, 400, "This email is already registered", []);
      }

      if (!req.file || !req.file.filename) {
        return sendResponse(res, 400, "Image is required", []);
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      const saveData = await userModel.create({
        name,
        email,
        mobileno,
        password: hashedPassword,
        image: req.file.filename,
      });

      if (saveData._id) {
        const emailData = { name: saveData.name };
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
          "Your registration has been successfully completed!",
          saveData
        );
      } else {
        return sendResponse(res, 400, "Something went wrong", []);
      }
    } catch (err) {
      return sendResponse(res, 500, "Internal server error", err.message);
    }
  }
}

module.exports = new RegisterController();
