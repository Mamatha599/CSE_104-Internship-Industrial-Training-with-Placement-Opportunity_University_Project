const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  studentId: Joi.string().required(),
  department: Joi.string().required(),
  year: Joi.number().integer().min(1).max(4).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  department: Joi.string(),
  year: Joi.number().integer().min(1).max(4),
  cgpa: Joi.number().min(0).max(10),
  skills: Joi.array().items(Joi.string()),
  resume: Joi.string(),
  phone: Joi.string(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};