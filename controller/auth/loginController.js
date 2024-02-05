const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../helper/sendmail");

class loginController {
  // method authentication

  async userAuth(req, res, next) {
    try {
      if (!_.isEmpty(req.user)) {
        next();
      } else {
        res.json({
          status: 400,
          message: "UnAuthorized UseR .. Please Login",
          data: [],
        });
      }
    } catch (err) {
      throw err;
    }
  }

  //   method login //

  async login(req, res) {
    try {
      if (_.isEmpty(req.body.email)) {
        return res.json({
          status: 400,
          message: "Email is required",
          data: [],
        });
      }
      if (_.isEmpty(req.body.password)) {
        return res.json({
          status: 400,
          message: "password is required",
          data: [],
        });
      }
      let emailExist = await userModel.findOne({ email: req.body.email });

      if (_.isEmpty(emailExist)) {
        res.json({
          status: 400,
          message: "email does not exist with this account",
          data: [],
        });
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
          res.cookie('user_token',token)
          res.json({
            status: 200,
            message: "Login sucessfull",
            data: emailExist,
            token,
          });
        } else {
          res.status(400).json({
            message: "Bad credentials",
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }
  // method logout

  async logOut(req, res) {
    try {
      res.clearCookie("user_token");
      res.status(200).json({
        message: "logged out",
        data: [],
      });
    } catch (err) {
      throw err;
    }
  }
}
module.exports = new loginController();
