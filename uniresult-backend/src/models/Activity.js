import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    activityType: {
        type: String,
        required: [true, 'Activity type is required'],
        enum: ['TIMETABLE_UPLOAD', 'RESULT_UPLOAD', 'RESULT_DELETED', 'NEWS_POST', 'USER_LOGIN', 'SYSTEM_UPDATE', 'COMPLIANCE_SUBMIT']
    },
    activityName: {
        type: String,
        required: [true, 'Activity name is required']
    },
    description: {
        type: String,
        required: [true, 'Activity description is required']
    },
    performedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamDivisionMember',
        required: [true, 'Performed by is required']
    },
    performedByName: {
        type: String,
        required: [true, 'Performed by name is required']
    },
    performedByUsername: {
        type: String,
        required: [true, 'Performed by username is required']
    },
    performedByEmail: {
        type: String,
        required: [true, 'Performed by email is required']
    },
    performedByRole: {
        type: String,
        required: [true, 'Performed by role is required'],
        enum: ['examDiv', 'admin', 'student']
    },
    faculty: {
        type: String
    },
    year: {
        type: String
    },
    fileName: {
        type: String
    },
    fileSize: {
        type: Number
    },
    status: {
        type: String,
        enum: ['NEW', 'READ', 'ARCHIVED'],
        default: 'NEW'
    },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'MEDIUM'
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Index for efficient queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ performedBy: 1 });
activitySchema.index({ activityType: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ priority: 1 });

// Virtual for formatted timestamp
activitySchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

activitySchema.virtual('formattedTime').get(function() {
    return this.createdAt.toLocaleTimeString();
});

// Method to mark as read
activitySchema.methods.markAsRead = function() {
    this.status = 'READ';
    return this.save();
};

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;