const applicationService = require('./application.service');
const { sendResponse, sendError } = require('../../utils/response.util');

class ApplicationController {
  async applyForOpportunity(req, res) {
    try {
      const { opportunityId, coverLetter } = req.body;
      
      if (!opportunityId) {
        return sendError(res, 400, 'Opportunity ID is required');
      }

      const application = await applicationService.applyForOpportunity(
        req.user.id,
        opportunityId,
        coverLetter
      );

      sendResponse(res, 201, true, 'Application submitted successfully', application);
    } catch (error) {
      sendError(res, 400, error.message);
    }
  }

  async getMyApplications(req, res) {
    try {
      const applications = await applicationService.getStudentApplications(req.user.id);
      sendResponse(res, 200, true, 'Applications retrieved successfully', applications);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async getApplicationById(req, res) {
    try {
      const application = await applicationService.getApplicationById(
        req.params.id,
        req.user.id
      );

      if (!application) {
        return sendError(res, 404, 'Application not found');
      }

      sendResponse(res, 200, true, 'Application retrieved successfully', application);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

module.exports = new ApplicationController();