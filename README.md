
# UniResult - University Exam Result Management System

<div align="center">

![UniResult Logo](https://img.shields.io/badge/UniResult-University%20Exam%20Management-blue?style=for-the-badge&logo=react)
![Version](https://img.shields.io/badge/Version-1.1-green?style=flat-square)
![License](https://img.shields.io/badge/License-Educational-orange?style=flat-square)

*A comprehensive full-stack web application for managing university exam results, built with modern technologies and best practices.*

[🚀 Live Demo](#) | [📖 Documentation](#) | [📋 API Docs](uniresult-backend/API_DOCUMENTATION.md)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Installation & Setup](#-installation--setup)
- [🔐 Authentication](#-authentication)
- [📁 Project Structure](#-project-structure)
- [🔒 Security Features](#-security-features)
- [🧪 Testing](#-testing)
- [📱 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Support](#-support)

---

## ✨ Features

### 🎓 **Student Portal**
- **Personal Dashboard**: GPA tracking, result history, and academic performance analytics
- **Result Management**: View detailed exam results with grade breakdowns
- **Profile Management**: Update personal information and contact details
- **Notification Center**: Real-time updates on result publications and announcements

### 👨‍💼 **Admin Panel**
- **User Management**: Complete CRUD operations for students, faculty, and staff
- **System Oversight**: Monitor system usage, compliance, and performance metrics
- **Content Management**: Manage announcements, timetables, and system-wide notifications
- **Audit Trail**: Track all administrative actions and system changes

### 📊 **Exam Division Portal**
- **Result Upload System**: Secure bulk upload of exam results with validation
- **Member Management**: Manage examination division staff and permissions
- **Activity Tracking**: Monitor result uploads, announcements, and system activities
- **Document Management**: Handle timetables, guidelines, and official documents

### 🔧 **Core Features**
- **Multi-role Authentication**: Secure JWT-based authentication with role-based access control
- **File Upload System**: Robust document upload with preview and validation
- **Responsive Design**: Mobile-first approach ensuring optimal experience across devices
- **Real-time Notifications**: Instant updates and activity tracking system

---

## 🛠️ Technology Stack

### 🎨 **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| ![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react) | 18.2.0 | UI Framework |
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript) | ES6+ | Programming Language |
| ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.0-blue?style=flat-square&logo=tailwind-css) | 3.3.0 | CSS Framework |
| ![React Router](https://img.shields.io/badge/React_Router-6.4.0-ca4245?style=flat-square&logo=react-router) | 6.4.0 | Routing |
| ![Axios](https://img.shields.io/badge/Axios-1.4.0-purple?style=flat-square) | 1.4.0 | HTTP Client |

### ⚙️ **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js) | 18.x | Runtime Environment |
| ![Express.js](https://img.shields.io/badge/Express.js-4.18.0-black?style=flat-square&logo=express) | 4.18.0 | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat-square&logo=mongodb) | 7.0 | Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-7.5.0-red?style=flat-square) | 7.5.0 | ODM |
| ![JWT](https://img.shields.io/badge/JWT-9.0.0-orange?style=flat-square) | 9.0.0 | Authentication |

### 🛡️ **Security & Utilities**
- **bcryptjs**: Password hashing and verification
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Dotenv**: Environment variable management

---

## 📋 Prerequisites

<div align="center">

### System Requirements

| Component | Version | Download Link |
|-----------|---------|---------------|
| **Node.js** | ≥16.0.0 | [Download](https://nodejs.org/) |
| **MongoDB** | ≥5.0 | [Download](https://www.mongodb.com/try/download/community) |
| **npm/yarn** | Latest | Included with Node.js |

</div>

### 📦 **Additional Requirements**
- MongoDB Atlas account (recommended) or local MongoDB instance
- Git for version control
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 🚀 Installation & Setup

### 1. 📥 Clone the Repository
```bash
git clone https://github.com/ChamathLahiru-CL/UniResult.git
cd UniResult
```

### 2. ⚙️ Backend Configuration
```bash
cd uniresult-backend

# Install backend dependencies
npm install

# Create environment configuration
cp .env.example .env
```

**Configure your `.env` file:**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/uniresult
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

### 3. 🎨 Frontend Setup
```bash
# Return to root directory
cd ..

# Install frontend dependencies
npm install
```

### 4. 🗄️ Database Initialization
The application automatically creates required collections and indexes on first run. For initial admin setup:

```bash
cd uniresult-backend
node src/utils/createAdminUser.js
```

### 5. ▶️ Running the Application

#### Development Mode
```bash
# Terminal 1: Start Backend Server
cd uniresult-backend
npm run dev

# Terminal 2: Start Frontend Development Server
cd ..
npm run dev
```

#### Production Build
```bash
# Build optimized frontend
npm run build

# Start production server
cd uniresult-backend
npm start
```

<div align="center">

### 🌐 Access Points
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs

</div>

---

## 🔐 Authentication

### 👥 **User Roles & Permissions**

| Role | Permissions | Access Level |
|------|-------------|--------------|
| **Student** | View personal results, profile management | Basic |
| **Admin** | Full system access, user management | Elevated |
| **Exam Division** | Result uploads, member management | Specialized |

### 🔑 **Default Credentials**
After initial setup, create your first admin user using the provided utility script.

---

## 📁 Project Structure

```
UniResult/
├── 📁 public/                          # Static assets
│   └── 📁 timetables/                  # Sample timetable images
├── 📁 src/                             # Frontend source code
│   ├── 📁 components/                  # Reusable UI components
│   │   ├── 📁 admin/                   # Admin-specific components
│   │   ├── 📁 dashboard/               # Dashboard components
│   │   └── 📁 examdivision/            # Exam division components
│   ├── 📁 pages/                       # Page components
│   ├── 📁 contexts/                    # React context providers
│   ├── 📁 hooks/                       # Custom React hooks
│   └── 📁 utils/                       # Frontend utilities
├── 📁 uniresult-backend/               # Backend application
│   ├── 📁 src/
│   │   ├── 📁 controllers/             # API route controllers
│   │   ├── 📁 models/                  # MongoDB data models
│   │   ├── 📁 routes/                  # API route definitions
│   │   ├── 📁 middleware/              # Custom middleware
│   │   ├── 📁 utils/                   # Backend utilities
│   │   └── 📁 config/                  # Configuration files
│   ├── 📁 public/uploads/              # File upload directory
│   └── 📄 .env.example                 # Environment template
├── 📄 package.json                     # Frontend dependencies
├── 📄 vite.config.js                   # Vite configuration
├── 📄 tailwind.config.js               # TailwindCSS configuration
└── 📄 README.md                        # Project documentation
```

---

## 🔒 Security Features

<div align="center">

### 🛡️ Security Implementation

| Feature | Technology | Purpose |
|---------|------------|---------|
| **Authentication** | JWT + bcrypt | Secure user authentication |
| **Authorization** | Role-based Access Control | Granular permission management |
| **Data Protection** | Input validation & sanitization | Prevent injection attacks |
| **File Security** | Multer validation | Safe file upload handling |
| **CORS** | Configured origins | Cross-origin protection |
| **Environment** | dotenv | Secure configuration management |

</div>

### 🔐 **Security Best Practices**
- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with configurable expiration
- Input validation and sanitization
- File type and size restrictions
- Rate limiting and request throttling
- Secure headers with Helmet.js

---

## 🧪 Testing

### 📊 Test Case Documentation

Comprehensive test cases and testing scenarios are documented in our [Test Case Google Sheet](https://docs.google.com/spreadsheets/d/1WfXBmCcX_GZOAh6FIZnaFJAqfVo_Qtt3aU6heKVvO6A/edit?usp=sharing).

#### 📋 Test Coverage Areas:
- **Authentication & Authorization**: Login, registration, role-based access
- **User Management**: CRUD operations for all user types
- **Result Management**: Upload, view, and manage exam results
- **File Upload System**: Document upload, validation, and retrieval
- **API Endpoints**: All REST API functionality testing
- **UI/UX Testing**: Responsive design and user interaction flows

#### 🗂️ Test Case Categories:
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API endpoint and database interaction testing
- **End-to-End Tests**: Complete user workflow testing
- **Security Tests**: Authentication, authorization, and data protection
- **Performance Tests**: Load testing and response time validation

#### 📈 Test Execution:
```bash
# Run backend tests
cd uniresult-backend
npm test

# Run frontend tests
cd ..
npm test
```

---

## 📱 API Documentation

Complete API documentation is available in [`uniresult-backend/API_DOCUMENTATION.md`](uniresult-backend/API_DOCUMENTATION.md)

### 🔗 Key API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|---------|
| `/api/auth/login` | POST | User authentication | Public |
| `/api/auth/register` | POST | User registration | Public |
| `/api/results` | GET/POST | Result management | Authenticated |
| `/api/users` | GET | User management | Admin |
| `/api/upload` | POST | File upload | Authenticated |

---

## 🤝 Contributing

We welcome contributions to improve UniResult! Please follow these guidelines:

### 📝 Contribution Process
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 🐛 Reporting Issues
- Use the issue templates provided
- Include detailed steps to reproduce
- Attach screenshots for UI-related issues
- Specify your environment (OS, Node.js version, etc.)

### 📋 Development Guidelines
- Follow ESLint configuration
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

<div align="center">

### Educational License
This project is developed for educational purposes and demonstration of full-stack development skills. Please ensure compliance with your institution's policies regarding code sharing and deployment.

**© 2025 Chamath Lahiru. All rights reserved.**

</div>

---

## 👥 Support

<div align="center">

### 📞 Get Help

| Support Channel | Contact | Response Time |
|-----------------|---------|---------------|
| **GitHub Issues** | [Create Issue](https://github.com/ChamathLahiru-CL/UniResult/issues) | 24-48 hours |
| **Documentation** | [Wiki](https://github.com/ChamathLahiru-CL/UniResult/wiki) | Immediate |
| **Email** | chamathlahiru@example.com | 1-3 business days |

### 📚 Resources
- [API Documentation](uniresult-backend/API_DOCUMENTATION.md)
- [Setup Guide](README.md#installation--setup)
- [Contributing Guidelines](README.md#contributing)

---

<div align="center">

**Built with ❤️ by Chamath Lahiru**

⭐ Star this repository if you found it helpful!

[⬆️ Back to Top](#uniresult---university-exam-result-management-system)

</div>
