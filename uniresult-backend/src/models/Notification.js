import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    // Notification type: 'result', 'news', 'timetable', 'gpa'
    type: {
        type: String,
        required: true,
        enum: ['result', 'news', 'timetable', 'gpa', 'system', 'compliance']
    },
    
    // Title of the notification
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    // Detailed message
    message: {
        type: String,
        required: true
    },
    
    // Link to navigate to when notification is clicked
    link: {
        type: String,
        default: null
    },
    
    // Priority level
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    
    // Target recipients (all students matching these criteria)
    recipients: {
        faculty: {
            type: String,
            default: null // null means all faculties
        },
        year: {
            type: String,
            default: null // null means all years in faculty
        },
        semester: {
            type: String,
            default: null // null means all semesters
        },
        role: {
            type: String,
            enum: ['student', 'admin', 'examDiv', 'examdivision', null],
            default: null // null means for students
        }
    },
    
    // Individual users who have read this notification
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
    
    // Metadata for different notification types
    metadata: {
        // For result notifications
        subjectCode: String,
        subjectName: String,
        semester: String,
        year: String,
        
        // For news notifications
        newsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'News'
        },
        newsTopic: String,
        
        // For timetable notifications
        timetableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TimeTable'
        },
        
        // For GPA notifications
        gpa: Number,
        level: String
    },
    
    // Who created this notification (Admin or Exam Division)
    createdBy: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        role: {
            type: String,
            enum: ['admin', 'examdivision', 'examDiv', 'student']
        }
    },
    
    // Status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
notificationSchema.index({ 'recipients.faculty': 1, 'recipients.year': 1 });
notificationSchema.index({ type: 1, isActive: 1 });
notificationSchema.index({ createdAt: -1 });

// Method to check if user has read this notification
notificationSchema.methods.isReadByUser = function(userId) {
    return this.readBy.some(read => read.userId.toString() === userId.toString());
};

// Method to mark as read by user
notificationSchema.methods.markAsReadByUser = async function(userId) {
    if (!this.isReadByUser(userId)) {
        this.readBy.push({
            userId,
            readAt: new Date()
        });
        await this.save();
    }
    return this;
};

// Static method to get notifications for a specific user
notificationSchema.statics.getForUser = async function(user, options = {}) {
    console.log('🔍 Building notification query for user:', {
        faculty: user.faculty,
        year: user.year,
        role: user.role
    });
    
    const query = {
        isActive: true,
        $or: [
            // Role-specific notifications
            { 'recipients.role': user.role },
            { 'recipients.role': null }, // For backward compatibility
            // Faculty-specific notifications (for students)
            { 
                'recipients.role': { $in: [null, 'student'] },
                $or: [
                    { 'recipients.faculty': user.faculty },
                    { 'recipients.faculty': null }
                ]
            }
        ]
    };
    
    // For students, filter by year if specified in recipients
    if (user.role === 'student' && user.year) {
        const yearCondition = [
            { 'recipients.year': user.year },
            { 'recipients.year': null }
        ];
        query.$and = [
            query,
            { $or: yearCondition }
        ];
    }
    
    console.log('📝 Query:', JSON.stringify(query, null, 2));
    
    const notifications = await this.find(query)
        .sort({ createdAt: -1 })
        .limit(options.limit || 50)
        .populate('createdBy.userId', 'name email')
        .populate('metadata.newsId', 'topic')
        .lean();
    
    console.log(`📊 Found ${notifications.length} notifications in database`);
    notifications.forEach(notif => {
        console.log(`  - ${notif.type}: ${notif.title} (Role: ${notif.recipients.role}, Faculty: ${notif.recipients.faculty}, Year: ${notif.recipients.year})`);
    });
    
    const userId = user.id || user._id;
    return notifications.map(notif => ({
        ...notif,
        isRead: notif.readBy.some(read => read.userId.toString() === userId.toString())
    }));
};

export default mongoose.model('Notification', notificationSchema);
