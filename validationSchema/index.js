const Joi = require('joi');

// Register Validation 
const registerValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileno: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

// Login Validation 
const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = {registerValidation,loginValidation};
