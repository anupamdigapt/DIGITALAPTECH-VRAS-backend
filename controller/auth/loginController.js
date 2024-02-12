const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../helper/sendmail");
const { sendResponse } = require("../../helper/sendResponse");
const { loginValidation } = require("../../validationSchema/index");

class loginController {
  // Method Login
  async login(req, res) {
    try {
      const validationResult = loginValidation.validate(req.body);
      if (validationResult.error) {
        return sendResponse(res,400,validationResult.error.details[0].message)
      }
      let emailExist = await userModel.findOne({ email: req.body.email });
      if (_.isEmpty(emailExist)) {
        return sendResponse(res,400,"Email does not exist with this account!")
      } else {
        const hash_password = emailExist.password;
        if (bcrypt.compareSync(req.body.password, hash_password)) {
          let token = jwt.sign(
            {
              id: emailExist._id,
            },
            "abcdefg",
            { expiresIn: "2d" }
          );
        res.setHeader('Authorization', `${token}`);
          res.json({
            status: 200,
            message: "login Sucessfull !!!",
            data: emailExist,
            token,
          });
        } else {
          res.json({
            message: "Bad credentials",
          });
        }
      }
    } catch (err) {
      return res.status(300).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  }
  // Method Logout
}
module.exports = new loginController();
