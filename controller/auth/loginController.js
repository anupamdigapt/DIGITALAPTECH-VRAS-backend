const userModel = require("../../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../../helper/sendResponse");

class LoginController {
  // Method Login 
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendResponse(res, 400, "Email and password are required", []);
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return sendResponse(res, 400, "Email does not exist with this account", []);
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return sendResponse(res, 400, "Invalid password", []);
      }

      const token = jwt.sign({ id: user._id }, "abcdefg", { expiresIn: "2d" });

      res.setHeader('Authorization', `${token}`);
      return res.json({
        status: 200,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (err) {
      return sendResponse(res, 500, "Internal server error", err.message);
    }
  }
}

module.exports = new LoginController();
