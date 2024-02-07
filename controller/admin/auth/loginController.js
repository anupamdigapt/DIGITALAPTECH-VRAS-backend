const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../../helper/sendmail");
const {sendResponse} = require("../../helper/sendResponse");

class loginController {
  // method authentication
  
  async userAuth(req, res, next) {
    try {
      if (!_.isEmpty(req.user)) {
        next();
      } else {
        return sendResponse(res, 400, "unAUTHORIZED user plz login ", []);
      }
    } catch (err) {
      throw err;
    }
  }
  // method login

  async login(req, res) {
    try {
      if (_.isEmpty(req.body.email)) {
        return sendResponse(res, 400, "Email is Required", []);
      }
      if (_.isEmpty(req.body.password)) {
        return sendResponse(res, 400, "Password is Required", []);
      }
      let emailExist = await userModel.findOne({ email: req.body.email });

      if (_.isEmpty(emailExist)) {
        return sendResponse(res, 400, "Email does not exist with this account", []);
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
            status:200,
            message:"login Sucessfull !!!",
            data:emailExist,token
          })
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
