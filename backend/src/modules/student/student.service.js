const Student = require('./student.model');
const { generateToken } = require('../../utils/jwt.util');

class StudentService {
  async register(studentData) {
    const existingStudent = await Student.findOne({
      $or: [
        { email: studentData.email },
        { 'profile.studentId': studentData.studentId }
      ]
    });

    if (existingStudent) {
      throw new Error('Student with this email or student ID already exists');
    }

    const student = new Student({
      email: studentData.email,
      password: studentData.password,
      profile: {
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        studentId: studentData.studentId,
        department: studentData.department,
        year: studentData.year,
      }
    });

    await student.save();
    
    const token = generateToken({
      id: student._id,
      email: student.email,
      role: student.role,
    });

    return { student, token };
  }

  async login(email, password) {
    const student = await Student.findOne({ email, isActive: true });
    
    if (!student || !(await student.comparePassword(password))) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken({
      id: student._id,
      email: student.email,
      role: student.role,
    });

    return { student, token };
  }

  async getProfile(studentId) {
    return await Student.findById(studentId).select('-password');
  }

  async updateProfile(studentId, updateData) {
    return await Student.findByIdAndUpdate(
      studentId,
      { $set: { profile: { ...updateData } } },
      { new: true, runValidators: true }
    ).select('-password');
  }
}

module.exports = new StudentService();