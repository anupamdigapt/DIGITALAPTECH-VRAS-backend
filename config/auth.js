// JWT
const jwt = require("jsonwebtoken");
const accessTokenSecret = "jwtsecret";

// Bcrypt for hash Password
const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(10);
var guard = {};

guard.authJWT = (req, res, next) => {
    const header = req.headers.authorization;
    if (header) {
        const token = header.split(' ')[1];
        jwt.verify(token, accessTokenSecret, (err, user) => {
            try {
                return next();
            }
            catch (err) {
                res.json({
                    status: 400,
                    message: 'Not authorized.',
                    data: req.body
                });
            }
        });
    }
    else {
        res.json({
            status: 400,
            message: 'Authorization token missing.',
            data: req.body
        });
    }
}

module.exports = guard