import mongoose from 'mongoose';

// Schema for storing individual student results (linked to their account)
const studentResultSchema = new mongoose.Schema({
    // Link to student user account
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    
    // Registration number for matching (even if student not registered yet)
    registrationNo: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    
    // Reference to the original result sheet
    resultSheet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Result',
        required: true
    },
    
    // Result details
    grade: {
        type: String,
        trim: true,
        default: ''
    },
    remark: {
        type: String,
        trim: true,
        default: ''
    },
    
    // Subject/Course information (copied for easy access)
    subjectName: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        trim: true,
        default: ''
    },
    credits: {
        type: Number,
        default: 0
    },
    
    // Academic information
    faculty: {
        type: String,
        trim: true,
        default: ''
    },
    department: {
        type: String,
        trim: true,
        default: ''
    },
    academicYear: {
        type: String,
        trim: true,
        default: ''
    },
    semester: {
        type: String,
        trim: true,
        default: ''
    },
    year: {
        type: String,
        trim: true,
        default: ''
    },
    
    // Status
    isViewed: {
        type: Boolean,
        default: false
    },
    viewedAt: {
        type: Date
    },
    
    // File reference for downloading original
    fileUrl: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
studentResultSchema.index({ registrationNo: 1, resultSheet: 1 }, { unique: true });
studentResultSchema.index({ student: 1, createdAt: -1 });
studentResultSchema.index({ registrationNo: 1, createdAt: -1 });

// Static method to find results by registration number
studentResultSchema.statics.findByRegistration = function(registrationNo) {
    return this.find({ 
        registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') }
    })
    .populate('resultSheet', 'originalFileName uploadedByName uploadedAt')
    .sort({ createdAt: -1 });
};

// Static method to find results for a student user
studentResultSchema.statics.findByStudent = function(studentId) {
    return this.find({ student: studentId })
        .populate('resultSheet', 'originalFileName uploadedByName uploadedAt')
        .sort({ createdAt: -1 });
};

// Static method to link results to student account
studentResultSchema.statics.linkToStudent = async function(registrationNo, studentId) {
    return this.updateMany(
        { registrationNo: { $regex: new RegExp(`^${registrationNo}$`, 'i') } },
        { $set: { student: studentId } }
    );
};

const StudentResult = mongoose.model('StudentResult', studentResultSchema);

export default StudentResult;
