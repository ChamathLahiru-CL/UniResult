import mongoose from 'mongoose';

const academicAchievementSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    semester: {
        type: String,
        required: true,
        trim: true
    },
    academicYear: {
        type: String,
        required: true,
        trim: true
    },
    achievementType: {
        type: String,
        enum: ['deans_list', 'academic_excellence', 'research_excellence', 'leadership', 'sports', 'other'],
        default: 'other'
    },
    awardedBy: {
        type: String,
        trim: true,
        default: ''
    },
    awardedDate: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
academicAchievementSchema.index({ student: 1, awardedDate: -1 });
academicAchievementSchema.index({ student: 1, achievementType: 1 });

// Static method to find achievements by student
academicAchievementSchema.statics.findByStudent = function(studentId) {
    return this.find({ student: studentId, isActive: true })
        .sort({ awardedDate: -1 });
};

// Static method to find achievements by type
academicAchievementSchema.statics.findByType = function(studentId, type) {
    return this.find({ student: studentId, achievementType: type, isActive: true })
        .sort({ awardedDate: -1 });
};

const AcademicAchievement = mongoose.model('AcademicAchievement', academicAchievementSchema);

export default AcademicAchievement;