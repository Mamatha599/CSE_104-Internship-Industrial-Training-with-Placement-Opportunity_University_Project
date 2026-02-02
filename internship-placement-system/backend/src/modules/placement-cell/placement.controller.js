const { sendSuccessResponse } = require('../../utils/response.util');

const placementController = {
  getDashboard: async (req, res, next) => {
    try {
      sendSuccessResponse(res, 'Placement cell dashboard endpoint');
    } catch (error) {
      next(error);
    }
  },

  createOpportunity: async (req, res, next) => {
    try {
      sendSuccessResponse(res, 'Create opportunity endpoint');
    } catch (error) {
      next(error);
    }
  },

  getAllStudents: async (req, res, next) => {
    try {
      sendSuccessResponse(res, 'Get all students endpoint');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = placementController;