import mongoose from 'mongoose';
import config from './config.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`
✅ MongoDB Connected successfully
📦 Database: ${conn.connection.name}
🖥️  Host: ${conn.connection.host}
🌐 Port: ${conn.connection.port}
        `);
        
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

export default connectDB;