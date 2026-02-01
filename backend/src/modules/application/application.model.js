const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  opportunity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'shortlisted', 'interviewed', 'selected'],
    default: 'pending',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
  coverLetter: {
    type: String,
    maxlength: 1000,
  },
  feedback: {
    type: String,
  },
  interviewDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Ensure a student can only apply once per opportunity
applicationSchema.index({ student: 1, opportunity: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);