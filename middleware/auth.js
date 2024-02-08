const jwt = require("jsonwebtoken");

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      if (req.cookies && req.cookies.user_token) {
        jwt.verify(req.cookies.user_token, "abcdefg", (err, data) => {
          if (!err) {
            req.user = data;
            next();
          } else {
            console.log(err);
            next();
          }
        });
      } else {
        next();
      }
    } catch (err) {
      throw err;
    }
  }
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
}

function sendResponse(res, status, message, data) {
  return res.status(status).json({ message, data });
}
module.exports = new AuthJwt();
