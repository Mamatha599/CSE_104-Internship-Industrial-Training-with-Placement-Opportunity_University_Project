const Student = require('./student.model');

/**
 * Get student profile by userId
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Student profile
 */
const getProfile = async (userId) => {
    return await Student.findOne({ userId });
};

/**
 * Create a new student profile
 * @param {string} userId - User ID
 * @param {Object} data - Profile data
 * @returns {Promise<Object>} - Newly created profile
 */
const createProfile = async (userId, data) => {
    const profile = new Student({
        ...data,
        userId,
    });
    return await profile.save();
};

/**
 * Update an existing student profile
 * @param {string} userId - User ID
 * @param {Object} data - Updated profile data
 * @returns {Promise<Object>} - Updated profile
 */
const updateProfile = async (userId, data) => {
    // Prevent updating rollNumber if it's being passed
    if (data.rollNumber) {
        delete data.rollNumber;
    }

    return await Student.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true, runValidators: true }
    );
};

/**
 * Get all student profiles
 * @returns {Promise<Array>} - List of all students
 */
const getAllStudents = async () => {
    return await Student.find().populate('userId', 'email role');
};

module.exports = {
    getProfile,
    createProfile,
    updateProfile,
    getAllStudents,
};
