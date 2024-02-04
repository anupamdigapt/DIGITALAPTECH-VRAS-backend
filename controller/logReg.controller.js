const logReg = require("../model/logReg.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class loginRegisterController {
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
      req.body.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10)
      );
      let saveData = await logReg.create(req.body);
      if (!_.isEmpty(saveData) && saveData._id) {
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
        res.status(400).json({
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
            "vras",
            { expiresIn: "2d" }
          );
          res.cookie("user_token", token);
          res.status(200).json({
            message: "Login sucessfull",
            token: token,
          });
        } else {
          res.status(401).json({
            message: "Bad credentials",
          });
        }
      }
    } catch (err) {
      throw err;
    }
  }
  //   <<<<<<<<<<<< user dashboard >>>>>>>>>>>>>>>>>>
  async dashboard(req, res) {
    try {
      if (!_.isEmpty(req.user)) {
        let login_user = await userModel.findOne({ _id: req.user.id });
        res.status(200).json({
          message: `Welcome ${login_user.name}`,
          data: [login_user],
        });
      } else {
        res.status(401).json({
          message: "plz login",
          data: [],
        });
      }
    } catch (err) {
      throw err;
    }
  }

  // <<<<<<<<<< logout section >>>>>>>>>>>>>>>

  async logout(req, res) {
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
