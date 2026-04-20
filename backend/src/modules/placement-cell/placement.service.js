const User = require('../auth/auth.model');
const Student = require('../student/student.model');
const Opportunity = require('../opportunity/opportunity.model');
const Application = require('../application/application.model');
const Faculty = require('../faculty/faculty.model');

/**
 * Get system-wide dashboard statistics
 * @returns {Promise<Object>} - Statistics counts
 */
const getDashboardStats = async () => {
    const [totalStudents, totalOpportunities, totalApplications, totalPlacedStudents] = await Promise.all([
        Student.countDocuments(),
        Opportunity.countDocuments(),
        Application.countDocuments(),
        Application.countDocuments({ status: 'SELECTED' }),
    ]);

    return {
        totalStudents,
        totalOpportunities,
        totalApplications,
        totalPlacedStudents,
    };
};

/**
 * Get all applications with populated student and company details
 * @returns {Promise<Array>} - List of all applications
 */
const getAllApplications = async () => {
    return await Application.find()
        .populate({
            path: 'studentId',
            select: 'name rollNumber department',
        })
        .populate({
            path: 'opportunityId',
            select: 'companyName title',
        })
        .sort({ createdAt: -1 });
};

/**
 * Update the status of an application
 * @param {string} applicationId - ID of the application to update
 * @param {string} status - New status (Applied, Shortlisted, Selected, Rejected)
 * @returns {Promise<Object>} - Updated application
 */
const updateApplicationStatus = async (applicationId, status) => {
    const validStatuses = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED', 'APPROVED', 'PENDING APPROVAL'];
    if (!validStatuses.includes(status.toUpperCase())) {
        throw new Error('Invalid status value');
    }

    return await Application.findByIdAndUpdate(
        applicationId,
        { status: status.toUpperCase() },
        { new: true, runValidators: true }
    );
};

/**
 * Assign a faculty member to a group of students
 * @param {string} facultyId - User ID of the faculty
 * @param {Array<string>} studentIds - Array of Student IDs
 */
const assignFacultyToStudents = async (facultyId, studentIds) => {
    return await Student.updateMany(
        { _id: { $in: studentIds } },
        { $set: { assignedFaculty: facultyId } }
    );
};

/**
 * Update a user's role dynamically
 * @param {string} userId - ID of the user
 * @param {string} role - New role
 */
const updateUserRole = async (userId, role) => {
    const validRoles = ['student', 'admin', 'recruiter', 'faculty', 'coordinator', 'hod', 'dean'];
    if (!validRoles.includes(role)) {
        throw new Error('Invalid role');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true }
    );

    // If assigned a faculty-related role, ensure a Faculty profile exists to prevent 404 errors in the hub
    const facultyRoles = ['faculty', 'coordinator', 'hod', 'dean'];
    if (facultyRoles.includes(role)) {
        const existingProfile = await Faculty.findOne({ userId });
        if (!existingProfile) {
            // Attempt to pull basic info from existing student profile if this is a promotion
            const studentProfile = await Student.findOne({ userId });
            
            await Faculty.create({
                userId,
                facultyName: studentProfile ? studentProfile.name : 'Faculty Member',
                email: updatedUser.email,
                department: studentProfile ? studentProfile.department : 'Pending Assignment',
                designations: [role === 'faculty' ? 'mentor' : role]
            });
        } else {
            // If profile exists, ensure the new designation is added if not already present
            const targetDesignation = role === 'faculty' ? 'mentor' : role;
            if (!existingProfile.designations.includes(targetDesignation)) {
                existingProfile.designations.push(targetDesignation);
                await existingProfile.save();
            }
        }
    }

    return updatedUser;
};

module.exports = {
    getDashboardStats,
    getAllApplications,
    updateApplicationStatus,
    assignFacultyToStudents,
    updateUserRole,
};
