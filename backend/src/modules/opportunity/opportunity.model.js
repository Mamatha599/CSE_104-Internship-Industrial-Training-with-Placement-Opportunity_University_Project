const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['internship', 'placement'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    skills: [String],
    minCGPA: { type: Number, default: 0 },
    eligibleYears: [Number],
    departments: [String],
  },
  details: {
    duration: String,
    stipend: Number,
    location: String,
    mode: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'onsite',
    },
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Opportunity', opportunitySchema);