const studentService = require('./student.service');
const { sendResponse, sendError } = require('../../utils/response.util');
const { registerSchema, loginSchema, updateProfileSchema } = require('./student.validation');

class StudentController {
  async register(req, res) {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const { student, token } = await studentService.register(req.body);
      
      sendResponse(res, 201, true, 'Student registered successfully', {
        student: {
          id: student._id,
          email: student.email,
          profile: student.profile,
        },
        token,
      });
    } catch (error) {
      sendError(res, 400, error.message);
    }
  }

  async login(req, res) {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const { email, password } = req.body;
      const { student, token } = await studentService.login(email, password);

      sendResponse(res, 200, true, 'Login successful', {
        student: {
          id: student._id,
          email: student.email,
          profile: student.profile,
        },
        token,
      });
    } catch (error) {
      sendError(res, 401, error.message);
    }
  }

  async getProfile(req, res) {
    try {
      const student = await studentService.getProfile(req.user.id);
      sendResponse(res, 200, true, 'Profile retrieved successfully', student);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async updateProfile(req, res) {
    try {
      const { error } = updateProfileSchema.validate(req.body);
      if (error) {
        return sendError(res, 400, error.details[0].message);
      }

      const student = await studentService.updateProfile(req.user.id, req.body);
      sendResponse(res, 200, true, 'Profile updated successfully', student);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

module.exports = new StudentController();