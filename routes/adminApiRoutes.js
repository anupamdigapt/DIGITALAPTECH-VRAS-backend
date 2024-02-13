const router = require("express").Router();

// Import Controllers 

const registrationController = require('../controller/admin/auth/registerController')
// loginController = require('../controller/admin/auth/loginController')


// Registration Api
router.post("/register",registrationController.register)

module.exports = router;
