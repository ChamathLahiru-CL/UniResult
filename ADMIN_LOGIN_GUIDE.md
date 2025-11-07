# Admin Login & Database Connection Guide

## Current Issue
- 500 Internal Server Error when logging in as admin
- Backend cannot connect to MongoDB from certain scripts
- Admin user may not exist in database

## Solution Steps

### Step 1: Fix MongoDB Connection (CRITICAL)

**Option A: Whitelist Your IP (Recommended for Development)**
1. Go to https://cloud.mongodb.com
2. Sign in to your MongoDB Atlas account
3. Click on "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Click "Confirm"

**Option B: Add Current IP Only**
1. Visit https://whatismyipaddress.com to get your current IP
2. Add that specific IP in MongoDB Atlas Network Access

### Step 2: Create Admin User

Run this command to create the admin user:

```powershell
cd "d:\.2025 Project (Full Stack)\Exam Result Web Application 1.1\UniResult\uniresult-backend"
node src/utils/createAdminUser.js
```

This will create:
- **Username:** ADMIN2024
- **Password:** Admin@123
- **Role:** admin
- **Email:** admin@std.uwu.ac.lk

### Step 3: Start Backend Server

```powershell
cd "d:\.2025 Project (Full Stack)\Exam Result Web Application 1.1\UniResult\uniresult-backend"
node src/server.js
```

Watch for these success messages:
- ✅ MongoDB Connected successfully
- 🚀 Server running on port 5000

### Step 4: Test Admin Login

**Frontend Login Form:**
1. Username: `ADMIN2024`
2. Password: `Admin@123`
3. Role: Select "Admin"
4. Click Login

**Expected Backend Logs:**
```
🔐 Login attempt: { username: 'ADMIN2024', role: 'admin', hasPassword: true }
✅ User found: { username: 'ADMIN2024', role: 'admin', name: 'Admin User', hasPassword: true }
🔑 Password validation: { isValid: true }
```

## Admin Dashboard Features

The admin dashboard is already built with these pages:
- **AdminDashboard.jsx** - Main dashboard overview
- **AdminStudentManagementPage.jsx** - Manage students
- **AdminStudentResultPage.jsx** - Manage student results
- **AdminExamDivisionPage.jsx** - Exam division management
- **AdminCompliancePage.jsx** - Compliance tracking
- **AdminAnnouncementPage.jsx** - System announcements
- **AdminProfileSettings.jsx** - Admin profile settings
- **AdminSettingsPage.jsx** - System settings
- **AdminHelpPage.jsx** - Help and support
- **AdminRecentActivitiesPage.jsx** - Activity logs

## Backend API Endpoints Already Available

### Authentication
- `POST /api/auth/login` - Login (student/admin/examDiv)
- `POST /api/auth/register` - Register new user

### User Profile (Protected)
- `GET /api/user/profile` - Get current user profile
- `PUT /api/user/phone` - Update phone number
- `PUT /api/user/profile-image` - Update profile image
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/account` - Delete account
- `GET /api/user/stats` - Get user statistics

## Troubleshooting

### Issue: MongoDB Connection Error
**Solution:** Whitelist IP address in MongoDB Atlas

### Issue: Admin user not found
**Solution:** Run createAdminUser.js script

### Issue: Password incorrect
**Solution:** Password is case-sensitive: `Admin@123` (capital A)

### Issue: Backend not running
**Solution:** Start server with `node src/server.js`

### Issue: Port 5000 already in use
**Solution:** 
```powershell
taskkill /F /IM node.exe /T
```
Then restart server

## Testing Login Flow

### 1. Check Backend is Running
Look for port 5000 listener:
```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen
```

### 2. Check MongoDB Connection
Backend logs should show:
```
✅ MongoDB Connected successfully
📦 Database: test
🖥️  Host: ac-mh8t6vx-shard-00-01.osxeohy.mongodb.net
🌐 Port: 27017
```

### 3. Test Login
Frontend console should show:
```
Sending login request: {username: 'ADMIN2024', role: 'admin', hasPassword: true}
Login successful
```

Backend console should show:
```
🔐 Login attempt: { username: 'ADMIN2024', role: 'admin', hasPassword: true }
✅ User found
🔑 Password validation: { isValid: true }
```

### 4. Verify Dashboard Access
After successful login, you should be redirected to:
- Students → `/dash` (Student Dashboard)
- Admin → `/admin/dash` (Admin Dashboard)
- Exam Division → `/examdiv/dash` (Exam Division Dashboard)

## Next Steps

After login works:
1. Admin dashboard pages will need backend API integration
2. Create additional endpoints for admin features:
   - Student management CRUD operations
   - Result management
   - Announcement system
   - Compliance tracking
   - User analytics

## Quick Reference

**Admin Credentials:**
- Username: ADMIN2024
- Password: Admin@123
- Role: admin

**Student Test Account:**
- Username: UWUICT22
- Password: 123456
- Role: student

**Backend URL:** http://localhost:5000
**Frontend URL:** http://localhost:5173
