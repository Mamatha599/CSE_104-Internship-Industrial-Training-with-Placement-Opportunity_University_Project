const Joi = require('joi');

const studentValidation = {
  // Validate student profile creation
  validateStudentProfile: (data) => {
    const schema = Joi.object({
      studentId: Joi.string().required(),
      department: Joi.string().required(),
      course: Joi.string().required(),
      semester: Joi.number().integer().min(1).max(8).required(),
      cgpa: Joi.number().min(0).max(10),
      skills: Joi.array().items(Joi.string()),
      interests: Joi.array().items(Joi.string())
    });

    return schema.validate(data);
  },

  // Validate student profile update
  validateStudentProfileUpdate: (data) => {
    const schema = Joi.object({
      department: Joi.string(),
      course: Joi.string(),
      semester: Joi.number().integer().min(1).max(8),
      cgpa: Joi.number().min(0).max(10),
      skills: Joi.array().items(Joi.string()),
      interests: Joi.array().items(Joi.string()),
      placementStatus: Joi.string().valid('seeking', 'placed', 'not_interested')
    });

    return schema.validate(data);
  },

  // Validate application data
  validateApplication: (data) => {
    const schema = Joi.object({
      coverLetter: Joi.string().max(1000),
      additionalInfo: Joi.string().max(500)
    });

    return schema.validate(data);
  }
};

module.exports = studentValidation;