const Application = require('./application.model');
const Opportunity = require('../opportunity/opportunity.model');

class ApplicationService {
  async applyForOpportunity(studentId, opportunityId, coverLetter) {
    // Check if opportunity exists and is active
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || !opportunity.isActive) {
      throw new Error('Opportunity not found or inactive');
    }

    // Check if application deadline has passed
    if (new Date() > opportunity.applicationDeadline) {
      throw new Error('Application deadline has passed');
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: studentId,
      opportunity: opportunityId,
    });

    if (existingApplication) {
      throw new Error('You have already applied for this opportunity');
    }

    const application = new Application({
      student: studentId,
      opportunity: opportunityId,
      coverLetter,
    });

    await application.save();
    return await Application.findById(application._id)
      .populate('opportunity', 'title company type')
      .populate('student', 'profile.firstName profile.lastName profile.studentId');
  }

  async getStudentApplications(studentId) {
    return await Application.find({ student: studentId })
      .populate('opportunity', 'title company type applicationDeadline')
      .sort({ createdAt: -1 });
  }

  async getApplicationById(applicationId, studentId) {
    return await Application.findOne({
      _id: applicationId,
      student: studentId,
    }).populate('opportunity');
  }
}

module.exports = new ApplicationService();