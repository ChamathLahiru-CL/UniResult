import mongoose from 'mongoose';

const timeTableSchema = new mongoose.Schema({
    faculty: {
        type: String,
        required: [true, 'Faculty is required'],
        enum: {
            values: ['Technological Studies', 'Applied Science', 'Management', 'Agriculture', 'Medicine'],
            message: 'Please select a valid faculty'
        }
    },
    year: {
        type: String,
        required: [true, 'Year is required'],
        enum: {
            values: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
            message: 'Please select a valid year'
        }
    },
    fileName: {
        type: String,
        required: [true, 'File name is required'],
        trim: true
    },
    originalFileName: {
        type: String,
        required: [true, 'Original file name is required'],
        trim: true
    },
    filePath: {
        type: String,
        required: [true, 'File path is required']
    },
    fileUrl: {
        type: String,
        required: [true, 'File URL is required']
    },
    fileType: {
        type: String,
        required: [true, 'File type is required'],
        enum: ['pdf', 'jpg', 'jpeg', 'png']
    },
    fileSize: {
        type: Number,
        required: [true, 'File size is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Uploader is required']
    },
    uploadedByName: {
        type: String,
        required: [true, 'Uploader name is required']
    },
    uploadedByUsername: {
        type: String,
        required: [true, 'Uploader username is required']
    },
    uploadedByEmail: {
        type: String,
        required: [true, 'Uploader email is required']
    },
    uploadedByRole: {
        type: String,
        required: [true, 'Uploader role is required'],
        enum: ['student', 'admin', 'examDiv']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    downloadCount: {
        type: Number,
        default: 0
    },
    lastDownloaded: {
        type: Date
    }
}, {
    timestamps: true
});

// Index for efficient queries
timeTableSchema.index({ faculty: 1, year: 1, createdAt: -1 });
timeTableSchema.index({ uploadedBy: 1 });
timeTableSchema.index({ isActive: 1 });

// Virtual for formatted file size
timeTableSchema.virtual('formattedFileSize').get(function() {
    const size = this.fileSize;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

// Method to increment download count
timeTableSchema.methods.incrementDownloadCount = function() {
    this.downloadCount += 1;
    this.lastDownloaded = new Date();
    return this.save();
};

const TimeTable = mongoose.model('TimeTable', timeTableSchema);

export default TimeTable;