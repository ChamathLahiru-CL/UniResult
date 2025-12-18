
# UniResult - University Exam Result Management System

A comprehensive full-stack web application for managing university exam results, built with React (frontend) and Node.js/Express (backend) with MongoDB.

## 🚀 Features

- **Multi-role Authentication**: Student, Admin, and Exam Division user roles
- **Exam Result Management**: Upload, view, and manage student exam results
- **Timetable Management**: Upload and display exam timetables
- **News & Announcements**: Post and manage university announcements
- **Student Dashboard**: GPA tracking, result history, and profile management
- **Admin Panel**: User management, system oversight, and compliance monitoring
- **Exam Division Portal**: Result uploads, member management, and activity tracking
- **File Upload System**: Secure document upload with preview functionality
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Notifications**: Activity tracking and notification system

## 🛠️ Tech Stack

### Frontend
- **React 18** - Functional components with hooks
- **JavaScript** - ES6+ features
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Heroicons** - Beautiful SVG icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd UniResult
```

### 2. Backend Setup
```bash
cd uniresult-backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
# From the root directory
npm install
```

### 4. Database Setup
The application will automatically create collections and indexes when you run it. However, you may want to create an admin user manually using the provided utility.

### 5. Running the Application

#### Development Mode
```bash
# Terminal 1: Start Backend
cd uniresult-backend
npm run dev

# Terminal 2: Start Frontend
npm run dev
```

#### Production Build
```bash
# Build frontend
npm run build

# Start backend (serves frontend statically)
cd uniresult-backend
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🔐 Default Credentials

After setup, you can create an admin user using the backend utilities or register through the application.

## 📁 Project Structure

```
UniResult/
├── public/                    # Static assets
│   └── timetables/           # Sample timetable images
├── src/                      # Frontend source
│   ├── components/           # Reusable components
│   ├── pages/               # Page components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom hooks
│   └── utils/               # Utility functions
├── uniresult-backend/        # Backend source
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Backend utilities
│   │   └── config/         # Configuration files
│   └── public/uploads/     # File uploads directory
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- File upload validation
- CORS protection
- Input sanitization

## 📱 API Documentation

API documentation is available in `uniresult-backend/API_DOCUMENTATION.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is for educational purposes. Please ensure you comply with your institution's policies regarding code sharing and deployment.

## 👥 Support

For questions or support, please refer to the documentation or create an issue in the repository.