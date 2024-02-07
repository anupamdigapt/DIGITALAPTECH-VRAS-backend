const _ = require("underscore");

async function userAuth(req, res, next) {
  try {
    if (!_.isEmpty(req.user)) {
      next();
    } else {
      return sendResponse(res, 400, "unAUTHORIZED user plz login ", []);
    }
  } catch (err) {
    next(err);
  }
}

module.exports = { userAuth };
