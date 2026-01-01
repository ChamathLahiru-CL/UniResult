# Exam Division Compliance System - Quick Start Guide

## 🚀 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd uniresult-backend
npm install
```

**Note**: `pdfkit` package has already been installed.

#### Start Backend Server
```bash
npm run dev
```

Server will start on: `http://localhost:5000`

### 2. Frontend Setup

#### Start Frontend Development Server
```bash
# From root directory
npm run dev
```

Frontend will start on: `http://localhost:5174`

---

## 🧪 Testing the System

### Step 1: Create Test Data (If Needed)

You can use the existing compliance submission form for students to create test compliances, or insert directly into MongoDB:

```javascript
// Example MongoDB insert
db.compliances.insertOne({
  student: ObjectId("..."), // existing student ID
  studentName: "Test Student",
  studentEmail: "test@example.com",
  studentIndexNumber: "ENG/2023/999",
  topic: "Test Compliance",
  recipient: "Exam Division",
  importance: "High",
  message: "This is a test compliance message for the Exam Division system.",
  selectedGroups: ["Exam Division"],
  attachments: [],
  status: "pending",
  isRead: false,
  readBy: [],
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Step 2: Login as Exam Division User

1. Navigate to: `http://localhost:5174/login`
2. Login with Exam Division credentials
   - **Role must be**: `examDivision` or `admin`

### Step 3: Access Compliance Page

1. After login, navigate to: **Exam Division > Student Compliance**
2. Or directly: `http://localhost:5174/exam-division/compliance`

### Step 4: Test Features

#### ✅ View Compliances
- Page should load all compliances sent to Exam Division
- Statistics should display at the top
- Each compliance card shows:
  - Student name and index number
  - Status badge
  - Topic
  - Message preview
  - Timestamp
  - Attachment count
  - Action buttons

#### ✅ Test Search
1. Type in search bar: student name, index number, topic, or message keyword
2. Press Enter or click search icon
3. Results should filter accordingly

#### ✅ Test Filters
1. Click "Filter" dropdown
2. Select: Unread, In Procedure, Done, or Issues
3. List should update to show only selected type

#### ✅ Test Download PDF
1. Click the download icon (📥) on any compliance
2. PDF should download automatically
3. Open PDF and verify:
   - Student information
   - Compliance details
   - Message content
   - Attachments list (if any)
   - Admin response (if any)
   - Proper formatting

#### ✅ Test Mark as Read
1. Find an unread compliance (shows "New" badge with blue background)
2. Click the eye icon (👁️) to view
3. Compliance should be marked as read
4. "New" badge should disappear
5. Unread count in statistics should decrease

#### ✅ Test Statistics
1. Verify stats cards show:
   - Unread
   - In Procedure
   - Resolved
   - Pending
   - Total
2. Numbers should match actual data

---

## 🔍 API Testing with Postman/cURL

### Get Exam Division Compliances
```bash
curl -X GET http://localhost:5000/api/compliance/exam-division/list \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Mark Compliance as Read
```bash
curl -X POST http://localhost:5000/api/compliance/COMPLIANCE_ID/read \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Download PDF
```bash
curl -X GET http://localhost:5000/api/compliance/COMPLIANCE_ID/pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output compliance.pdf
```

### Search Compliances
```bash
curl -X GET "http://localhost:5000/api/compliance/exam-division/list?search=marks&status=pending" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### Issue: Compliances not loading

**Check:**
1. Backend server is running: `http://localhost:5000`
2. MongoDB is connected (check backend console)
3. User is logged in with valid JWT token
4. User has role `examDivision` or `admin`
5. Browser console for error messages

**Solution:**
```bash
# Check backend logs
# Look for: "MongoDB Connected" message
# Look for: GET /api/compliance/exam-division/list - 200
```

### Issue: PDF not downloading

**Check:**
1. `pdfkit` package is installed: `npm list pdfkit`
2. Compliance ID is valid
3. Browser allows downloads
4. Network tab for errors

**Solution:**
```bash
# Reinstall pdfkit if needed
cd uniresult-backend
npm install pdfkit
```

### Issue: "Not authorized" error

**Check:**
1. JWT token is valid and not expired
2. User role is `examDivision` or `admin`
3. Token is included in Authorization header

**Solution:**
```javascript
// Check token in localStorage
console.log(localStorage.getItem('token'));

// Check user role
const token = localStorage.getItem('token');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log(payload.role); // should be 'examDivision' or 'admin'
```

### Issue: Search not working

**Check:**
1. Backend search parameter is being sent
2. No network errors in console
3. Data exists matching search criteria

**Solution:**
```javascript
// Check network request in browser DevTools
// Verify params: search=yourSearchTerm
```

---

## 📊 Expected Data Flow

```
User Action → Frontend Component → API Request → Backend Controller → Database Query → Response
                                                                          ↓
Frontend Update ← JSON Response ← Controller Processing ← Data Retrieval
```

### Example: Download PDF Flow
```
1. User clicks download button
2. handleDownloadPDF() called in StudentCompliance.jsx
3. GET /api/compliance/:id/pdf with JWT token
4. downloadCompliancePDF() in complianceController.js
5. Query MongoDB for compliance data
6. Generate PDF using pdfkit
7. Stream PDF to response
8. Browser receives blob and triggers download
```

---

## 🎯 Success Criteria

All features working correctly when:

- [x] Compliances load from database (no mock data)
- [x] Statistics show accurate real-time counts
- [x] Search filters compliances correctly
- [x] Filter dropdown works for all status types
- [x] PDF downloads with all compliance details
- [x] Read status updates when viewing
- [x] "New" badge appears on unread items
- [x] High priority items show priority badge
- [x] Attachment count displays correctly
- [x] Loading spinner shows during data fetch
- [x] Error messages display on failures
- [x] Mobile responsive layout works

---

## 📝 Sample Test Cases

### Test Case 1: Load Compliances
**Steps:**
1. Login as Exam Division user
2. Navigate to Student Compliance page

**Expected:**
- Page loads without errors
- Compliances display in list format
- Statistics show correct counts
- No console errors

### Test Case 2: Search Functionality
**Steps:**
1. Enter "marks" in search box
2. Press Enter

**Expected:**
- Only compliances containing "marks" display
- Search works across name, index, topic, message
- Results update immediately

### Test Case 3: PDF Download
**Steps:**
1. Click download icon on any compliance
2. Open downloaded PDF

**Expected:**
- PDF downloads automatically
- Filename: `compliance-{id}.pdf`
- Contains all sections: student info, details, message, attachments, response
- Professional formatting with proper layout

### Test Case 4: Mark as Read
**Steps:**
1. Find unread compliance (blue background, "New" badge)
2. Click eye icon

**Expected:**
- Compliance marked as read in database
- "New" badge disappears
- Background color changes to white
- Unread count in stats decreases by 1

---

## 🔄 Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] PDF generation works correctly
- [ ] Environment variables set correctly
- [ ] MongoDB connection string updated
- [ ] JWT secret configured
- [ ] File upload directory permissions set
- [ ] CORS configured for production domain
- [ ] Error logging implemented
- [ ] Rate limiting configured (optional)

---

## 📞 Support

If you encounter issues:

1. **Check Logs**: Backend console and browser DevTools
2. **Verify Database**: Ensure MongoDB is running and accessible
3. **Check Auth**: Verify JWT token and user role
4. **Review Code**: Check recent changes in git
5. **Test API**: Use Postman to test endpoints directly

---

## 🎉 Features Delivered

✅ **Complete Backend Integration**
- Real database queries
- No mock data
- Efficient pagination
- Advanced search

✅ **PDF Generation**
- Professional formatting
- All compliance details
- Downloadable documents

✅ **Read Tracking**
- Mark as read functionality
- Read status indicators
- Multiple reader support

✅ **Enhanced UI**
- Search functionality
- Filter system
- Statistics dashboard
- Loading states
- Error handling

✅ **Security**
- JWT authentication
- Role-based access
- Authorization checks

---

**Last Updated**: January 1, 2026  
**Status**: ✅ Ready for Testing  
**Version**: 1.0
