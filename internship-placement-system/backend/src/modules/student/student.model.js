const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  
  // Academic Information
  department: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  cgpa: {
    type: Number,
    min: 0,
    max: 10
  },
  
  // Skills and Interests
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  
  // Documents
  resume: {
    filename: String,
    url: String,
    uploadDate: Date
  },
  
  // Profile Status
  profileCompleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Placement Status
  placementStatus: {
    type: String,
    enum: ['seeking', 'placed', 'not_interested'],
    default: 'seeking'
  },
  
  // Mentor Assignment
  assignedMentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faculty'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ placementStatus: 1 });

module.exports = mongoose.model('Student', studentSchema);