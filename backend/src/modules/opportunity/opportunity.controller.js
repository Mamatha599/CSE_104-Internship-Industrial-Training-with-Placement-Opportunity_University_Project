const Opportunity = require('./opportunity.model');
const { sendResponse, sendError } = require('../../utils/response.util');

class OpportunityController {
  async getOpportunities(req, res) {
    try {
      const { type, page = 1, limit = 10 } = req.query;
      const filter = { isActive: true };
      
      if (type) {
        filter.type = type;
      }

      const opportunities = await Opportunity.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Opportunity.countDocuments(filter);

      sendResponse(res, 200, true, 'Opportunities retrieved successfully', {
        opportunities,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: opportunities.length,
        },
      });
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }

  async getOpportunityById(req, res) {
    try {
      const opportunity = await Opportunity.findById(req.params.id);
      
      if (!opportunity || !opportunity.isActive) {
        return sendError(res, 404, 'Opportunity not found');
      }

      sendResponse(res, 200, true, 'Opportunity retrieved successfully', opportunity);
    } catch (error) {
      sendError(res, 500, error.message);
    }
  }
}

module.exports = new OpportunityController();