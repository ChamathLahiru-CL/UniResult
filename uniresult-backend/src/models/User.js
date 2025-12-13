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
        trim: true,
        sparse: true,  // Allows multiple null/undefined values
        unique: true,
        // Only required for students, optional for admin and examDiv
        validate: {
            validator: function(value) {
                // If role is student, enrollmentNumber is required
                if (this.role === 'student' && !value) {
                    return false;
                }
                return true;
            },
            message: 'Enrollment number is required for students'
        }
    },
    department: {
        type: String,
        trim: true
    },
    faculty: {
        type: String,
        required: [true, 'Faculty is required'],
        enum: {
            values: ['Faculty of Technological Studies', 'Faculty of Applied Science', 'Faculty of Management', 'Faculty of Agriculture', 'Faculty of Medicine'],
            message: 'Please select a valid faculty'
        }
    },
    phoneNumber: {
        type: String,
        trim: true,
        default: ''
    },
    profileImage: {
        type: String,
        default: null
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