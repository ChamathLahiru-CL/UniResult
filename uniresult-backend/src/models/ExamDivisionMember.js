import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const examDivisionMemberSchema = new mongoose.Schema({
    nameWithInitial: {
        type: String,
        required: [true, 'Name with initial is required'],
        trim: true
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    username: {
        type: String,
        required: [true, 'Username (Exam Division Member ID) is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    position: {
        type: String,
        required: [true, 'Position is required'],
        enum: ['Exam Officer', 'Senior Coordinator', 'Coordinator', 'Assistant Coordinator']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
    profileImage: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Hash password before saving
examDivisionMemberSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
examDivisionMemberSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

// Method to get full name
examDivisionMemberSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

const ExamDivisionMember = mongoose.model('ExamDivisionMember', examDivisionMemberSchema);

export default ExamDivisionMember;
