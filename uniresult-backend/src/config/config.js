import dotenv from 'dotenv';
import process from 'process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config({ path: join(__dirname, '../../.env') });

// Get process environment
const { env } = process;

const config = {
    // Server Configuration
    NODE_ENV: env.NODE_ENV || 'development',
    PORT: env.PORT || 5000,
    
    // MongoDB Configuration
    MONGODB_URI: env.MONGODB_URI || 'mongodb+srv://LahiruJY:Uni2025@uniresultdb.osxeohy.mongodb.net/UniResultDB?retryWrites=true&w=majority',
    
    // JWT Configuration
    JWT_SECRET: env.JWT_SECRET || 'uniresult-secret-key-2025',
    JWT_EXPIRE: env.JWT_EXPIRE || '7d',
    JWT_COOKIE_EXPIRE: env.JWT_COOKIE_EXPIRE || 7,
    
    // Client URL for CORS
    CLIENT_URL: env.CLIENT_URL || 'http://localhost:5174',
    
    // Email Configuration (for future use)
    EMAIL_HOST: env.EMAIL_HOST,
    EMAIL_PORT: env.EMAIL_PORT,
    EMAIL_USER: env.EMAIL_USER,
    EMAIL_PASS: env.EMAIL_PASS,
    
    // Other Configuration
    MAX_FILE_UPLOAD: 1024 * 1024 * 5, // 5MB
    FILE_UPLOAD_PATH: './public/uploads'
};

export default config;