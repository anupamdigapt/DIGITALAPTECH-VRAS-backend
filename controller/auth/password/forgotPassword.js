const userModel = require("../../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../../helper/sendmail");
const { sendResponse } = require("../../../helper/sendResponse");

class forgotPasswordController {
  // auth section
  async userAuth(req, res, next) {
    try {
      if (!_.isEmpty(req.user)) {
        next();
      } else {
        return sendResponse(res, 400, "unAUTHORIZED user plz login ", []);
      }
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
  // forgot Password

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return sendResponse(res, 400, "user with this email not Exist", []);
      }
      const resetToken = jwt.sign(
        { email },
        process.env.RESET_PASSWORD_SECRET,
        { expiresIn: "20m" }
      );
      await userModel.updateOne({ email }, { resetToken });
      const resetPassword = `reset-password/${resetToken}`;
      await mailer.sendMail(
        process.env.EMAIL,
        email,
        "Reset Password",
        "resetPassword.ejs",
        { resetPassword }
      );
      return sendResponse(res, 200, "reset Password Link send your Email", []);
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
  // reset Password

  async resetPassword(req, res) {
    try {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;
      const decodedToken = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
      const user = await userModel.findOne({ email: decodedToken.email });
      if (!user) {
        return sendResponse(res, 400, "invalid Token!!!", []);
      }
      user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      await user.save();
      user.resetToken = undefined;
      await user.save();
      await mailer.sendMail(
        process.env.EMAIL,
        user.email,
        "Password Reset Confirmation",
        "resetPasswordConfirmation.ejs"
    );

      return sendResponse(res, 200, "Password Reset Sucessfully !!!", []);
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
}
module.exports = new forgotPasswordController();
