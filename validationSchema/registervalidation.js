const Joi = require('joi');

const registerValidation = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileno: Joi.string().required(),
  password: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

module.exports = registerValidation;
