import mongoose from 'mongoose';

// Schema for individual student result entry (parsed from PDF)
const studentResultEntrySchema = new mongoose.Schema({
    registrationNo: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    grade: {
        type: String,
        trim: true,
        default: ''
    },
    remark: {
        type: String,
        trim: true,
        default: ''
    }
}, { _id: false });

// Main Result Schema (for the uploaded result sheet)
const resultSchema = new mongoose.Schema({
    // PDF Metadata
    faculty: {
        type: String,
        required: [true, 'Faculty is required'],
        trim: true
    },
    department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true
    },
    degreeProgram: {
        type: String,
        trim: true,
        default: ''
    },
    level: {
        type: String,
        required: [true, 'Academic level is required'],
        enum: ['100', '200', '300', '400'],
        trim: true
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        enum: ['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester'],
        trim: true
    },
    academicYear: {
        type: String,
        trim: true,
        default: ''
    },
    subjectName: {
        type: String,
        required: [true, 'Subject name is required'],
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
    
    // File information
    originalFileName: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['pdf', 'image'],
        default: 'pdf'
    },
    fileSize: {
        type: Number,
        default: 0
    },
    
    // Parsed student results from PDF
    studentResults: [studentResultEntrySchema],
    resultCount: {
        type: Number,
        default: 0
    },
    
    // Parsing status
    parseStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed', 'requires_manual_entry'],
        default: 'pending'
    },
    parseError: {
        type: String,
        default: ''
    },
    parsedAt: {
        type: Date
    },
    
    // Upload information
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedByName: {
        type: String,
        default: ''
    },
    uploadedByUsername: {
        type: String,
        default: ''
    },
    uploadedByEmail: {
        type: String,
        default: ''
    },
    uploadedByRole: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for efficient querying
resultSchema.index({ 'studentResults.registrationNo': 1 });
resultSchema.index({ faculty: 1, department: 1, level: 1, semester: 1 });
resultSchema.index({ courseCode: 1 });
resultSchema.index({ createdAt: -1 });

// Virtual for getting results by registration number
resultSchema.methods.getResultByRegistration = function(registrationNo) {
    return this.studentResults.find(
        result => result.registrationNo.toUpperCase() === registrationNo.toUpperCase()
    );
};

const Result = mongoose.model('Result', resultSchema);

export default Result;
