import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username (Enrollment Number) is required'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: {
        type: String,
        enum: ['student', 'admin', 'examDiv'],
        default: 'student'
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    enrollmentNumber: {
        type: String,
        required: [true, 'Enrollment number is required'],
        trim: true,
        unique: true
    },
    department: {
        type: String,
        trim: true
    },
    agreeTerms: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        console.error('Password comparison error:', error);
        return false;
    }
};

// Method to get user's full name
userSchema.methods.getFullName = function() {
    return `${this.firstName} ${this.lastName}`;
};

const User = mongoose.model('User', userSchema);

export default User;