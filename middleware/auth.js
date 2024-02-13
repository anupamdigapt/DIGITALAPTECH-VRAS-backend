const jwt = require('jsonwebtoken');

class AuthJwt {
  async authJwt(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const token = authHeader
        jwt.verify(token, "abcdefg", (err, data) => {
          if (!err) {
            req.user = data;
          } else {
            console.log(err);
          }
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  async userAuth(req, res, next) {
    try {
      if (!_.isEmpty(req.user)) {
        next();
      } else {
        return sendResponse(res, 400, "Unauthorized user, please login", []);
      }
    } catch (err) {
      return res.status(500).json({
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



