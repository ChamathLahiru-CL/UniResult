import mongoose from 'mongoose';

const complianceSchema = new mongoose.Schema({
  // Student who submitted the compliance
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentIndexNumber: {
    type: String,
    required: true
  },
  
  // Compliance details
  topic: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Recipients
  recipient: {
    type: String,
    required: true,
    enum: ['admin', 'exam-division'],
  },
  selectedGroups: [{
    type: String,
    enum: ['Teachers', 'Exam Officers', 'Admin Staff']
  }],
  
  // Importance level
  importance: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low'
  },
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String
  }],
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  
  // Admin response
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedByName: String,
    respondedAt: Date
  },
  
  // Metadata
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
complianceSchema.index({ student: 1, createdAt: -1 });
complianceSchema.index({ recipient: 1, status: 1 });
complianceSchema.index({ importance: 1, status: 1 });

// Virtual for formatting date
complianceSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
});

const Compliance = mongoose.model('Compliance', complianceSchema);

export default Compliance;
