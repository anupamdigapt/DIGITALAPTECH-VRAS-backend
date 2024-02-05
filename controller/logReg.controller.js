const logReg = require("../model/logReg.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mailer = require("../helper/sendmail");

class loginRegisterController {
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

  // method registration //

  async register(req, res) {
    try {
      if (_.isEmpty(req.body.name)) {
        return res.json({
          status: 400,
          message: "name is required",
          data: [],
        });
      }
      if (_.isEmpty(req.body.email)) {
        return res.json({
          status: 400,
          message: "Email is Required",
          data: [],
        });
      }
      if (_.isEmpty(req.body.mobileno)) {
        return res.json({
          status: 400,
          message: "mobile no is Required",
          data: [],
        });
      }
      if (_.isEmpty(req.body.password)) {
        return res.json({
          status: 400,
          message: "password is Required",
          data: [],
        });
      }
      if (_.isEmpty(req.body.confirm_password)) {
        return res.json({
          status: 400,
          message: "confirm password is Required",
          data: [],
        });
      }

      let isEmailExist = await logReg.findOne({ email: req.body.email });

      if (!_.isEmpty(isEmailExist)) {
        return res.json({
          status: 400,
          message: "this email is already exist",
          data: [],
        });
      }
      if (req.body.password !== req.body.confirm_password) {
        return res.json({
          status: 400,
          message: "password and confirm password is does not matching ",
          data: [],
        });
      }
      req.body.image = req.file.filename;
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let saveData = await logReg.create(req.body);
      if (!_.isEmpty(saveData) && saveData._id) {
        await mailer.sendMail(
          process.env.EMAIL,
          saveData.email,
          "email submitted",
          `hiw ${saveData.name} your Registration has sucessfully done`
        );
        res.json({
          status: 200,
          message: " Your registration has been sucessfully completed ",
          data: saveData,
        });
        console.log("registration data", saveData);
      } else {
        res.json({
          status: 400,
          message: " something went wrong ",
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
      let emailExist = await logReg.findOne({ email: req.body.email });

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
          res.cookie("user_token", token);
          res.json({
            status: 200,
            message: "Login sucessfull",
            token: token,
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

  //   method update password //

  async changePassword(req, res) {
    try {
      const loginUser = await logReg.findOne({ _id: req.user.id });
      console.log("login user", loginUser);

      if (bcrypt.compareSync(req.body.oldPassword, loginUser.password)) {
        if (req.body.newPassword != req.body.confirmPassword) {
          res.json({
            status: 200,
            message: "password not matching ",
          });
        }
        if (req.body.newPassword == req.body.oldPassword) {
          res.json({
            status: 400,
            message: "New Password cannot be same as Old Password",
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
        let update_data = await logReg.findByIdAndUpdate(
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

  //   method logout
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
module.exports = new loginRegisterController();
