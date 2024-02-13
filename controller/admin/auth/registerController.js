const adminModel = require("../../../model/adminModel");
const bcrypt = require("bcryptjs");
const mailer = require("../../../helper/sendmail");
const { sendResponse } = require("../../../helper/sendResponse");
class RegisterController {
  async register(req, res) {
    try {

      const { email, password } = req.body;

      const isEmailExist = await adminModel.findOne({ email });
      if (isEmailExist) {
        return sendResponse(res, 400, "This email is already registered", []);
      }

      const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

      const saveData = await adminModel.create({
        email,
        password: hashedPassword,
      });

      if (saveData._id) {
        // const emailData = { name: saveData.name };
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
