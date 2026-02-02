const express = require('express');
const router = express.Router();

// Import all module routes
const authRoutes = require('../modules/auth/auth.routes');
const studentRoutes = require('../modules/student/student.routes');
const placementRoutes = require('../modules/placement-cell/placement.routes');
const facultyRoutes = require('../modules/faculty/faculty.routes');
const recruiterRoutes = require('../modules/recruiter/recruiter.routes');
const opportunityRoutes = require('../modules/opportunity/opportunity.routes');
const applicationRoutes = require('../modules/application/application.routes');
const feedbackRoutes = require('../modules/feedback/feedback.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/placement-cell', placementRoutes);
router.use('/faculty', facultyRoutes);
router.use('/recruiters', recruiterRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/applications', applicationRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/analytics', analyticsRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Internship & Placement Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      placementCell: '/api/placement-cell',
      faculty: '/api/faculty',
      recruiters: '/api/recruiters',
      opportunities: '/api/opportunities',
      applications: '/api/applications',
      feedback: '/api/feedback',
      analytics: '/api/analytics'
    }
  });
});

module.exports = router;