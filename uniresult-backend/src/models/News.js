import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    newsTopic: {
        type: String,
        required: [true, 'News topic is required'],
        trim: true,
        maxlength: [200, 'News topic cannot exceed 200 characters']
    },
    newsType: {
        type: String,
        required: [true, 'News type is required'],
        enum: {
            values: ['Announcement', 'Important Notice', 'Exam Update', 'General Information', 'Urgent Alert'],
            message: 'Please select a valid news type'
        }
    },
    faculty: {
        type: String,
        required: [true, 'Faculty is required'],
        enum: {
            values: ['Faculty of Technological Studies', 'Faculty of Applied Science', 'Faculty of Management', 'Faculty of Agriculture', 'Faculty of Medicine', 'All Faculties'],
            message: 'Please select a valid faculty'
        }
    },
    newsMessage: {
        type: String,
        required: [true, 'News message is required'],
        trim: true,
        maxlength: [2000, 'News message cannot exceed 2000 characters']
    },
    // File attachment details (optional)
    fileName: {
        type: String,
        trim: true
    },
    originalFileName: {
        type: String,
        trim: true
    },
    filePath: {
        type: String
    },
    fileUrl: {
        type: String
    },
    fileType: {
        type: String,
        enum: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'txt']
    },
    fileSize: {
        type: Number
    },
    // Upload details
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamDivisionMember',
        required: [true, 'Uploader is required']
    },
    uploadedByName: {
        type: String,
        required: [true, 'Uploaded by name is required']
    },
    uploadedByEmpNo: {
        type: String,
        required: [true, 'Employee number is required']
    },
    uploadedByEmail: {
        type: String,
        required: [true, 'Uploaded by email is required']
    },
    uploadedByRole: {
        type: String,
        required: [true, 'Uploaded by role is required'],
        enum: ['examDiv', 'admin']
    },
    // Status and visibility
    status: {
        type: String,
        enum: ['active', 'archived', 'draft'],
        default: 'active'
    },
    isVisible: {
        type: Boolean,
        default: true
    },
    // Read tracking
    readBy: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        readAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Priority
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    }
}, {
    timestamps: true
});

// Index for efficient queries
newsSchema.index({ faculty: 1 });
newsSchema.index({ newsType: 1 });
newsSchema.index({ status: 1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ uploadedBy: 1 });

// Virtual for formatted date
newsSchema.virtual('formattedDate').get(function() {
    return this.createdAt.toLocaleDateString();
});

newsSchema.virtual('formattedTime').get(function() {
    return this.createdAt.toLocaleTimeString();
});

// Method to mark as read by a user
newsSchema.methods.markAsReadBy = function(userId) {
    const existingRead = this.readBy.find(read => read.userId.toString() === userId.toString());
    if (!existingRead) {
        this.readBy.push({ userId, readAt: new Date() });
    }
    return this.save();
};

// Static method to get news for a specific faculty
newsSchema.statics.getNewsForFaculty = function(faculty) {
    return this.find({
        $or: [
            { faculty: faculty },
            { faculty: 'All Faculties' }
        ],
        status: 'active',
        isVisible: true
    }).sort({ createdAt: -1 });
};

const News = mongoose.model('News', newsSchema);

export default News;