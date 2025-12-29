# Notification System - Backend Implementation

## Overview
Comprehensive notification system that automatically creates notifications when:
1. **Results are uploaded** - Notifies students when their subject results are updated
2. **News is posted** - Alerts students about new announcements
3. **Timetables are uploaded** - Informs students when exam timetables are available
4. **GPA is updated** - Notifies students about GPA changes

## Files Created/Modified

### New Files
1. **models/Notification.js** - MongoDB schema for notifications
2. **controllers/notificationController.js** - Notification CRUD operations
3. **routes/notificationRoutes.js** - API endpoints for notifications

### Modified Files
1. **controllers/results.js** - Added result notification creation
2. **controllers/news.js** - Added news notification creation
3. **controllers/timeTable.js** - Added timetable notification creation
4. **server.js** - Registered notification routes

## API Endpoints

### Student Endpoints
- `GET /api/notifications` - Get all notifications for logged-in user
- `GET /api/notifications/unread-count` - Get count of unread notifications
- `PUT /api/notifications/:id/read` - Mark specific notification as read
- `PUT /api/notifications/read-all` - Mark all notifications as read

### Admin/Exam Division Endpoints
- `POST /api/notifications` - Create custom notification

## Notification Types

### 1. Result Notifications
**Type:** `result`
**Priority:** `high`
**Triggered:** When exam division uploads result PDFs
**Contains:**
- Subject name and code
- Semester and year
- Link to Results page
**Filtering:** Only shown to students of matching faculty, year, and semester

### 2. News Notifications
**Type:** `news`
**Priority:** Based on news priority (normal/high/urgent)
**Triggered:** When admin/exam division posts news
**Contains:**
- News topic
- Message preview (first 100 chars)
- Link to News page
**Filtering:** Only shown to students of matching faculty (all years)

### 3. Timetable Notifications
**Type:** `timetable`
**Priority:** `high`
**Triggered:** When exam division uploads timetable
**Contains:**
- Faculty and year information
- Link to Exam Timetable page
**Filtering:** Only shown to students of matching faculty and year

### 4. GPA Notifications
**Type:** `gpa`
**Priority:** `normal`
**Triggered:** When GPA is calculated/updated (future implementation)
**Contains:**
- Current GPA value
- Academic level
- Link to GPA Analytics page
**Filtering:** Only shown to students of matching faculty and level

## Smart Filtering

The notification system uses intelligent filtering to ensure students only see relevant notifications:

```javascript
// Example: Result notification filtering
recipients: {
    faculty: "Faculty of Technological Studies",
    year: "2nd Year",
    semester: "1st Semester"
}
```

Students see notifications if:
- Faculty matches exactly
- Year matches (or is null for faculty-wide notifications)
- Semester matches (optional)

## Database Schema

```javascript
{
    type: String,              // 'result', 'news', 'timetable', 'gpa'
    title: String,             // Notification title
    message: String,           // Detailed message
    link: String,              // Navigation link
    priority: String,          // 'low', 'normal', 'high', 'urgent'
    recipients: {
        faculty: String,       // Required
        year: String,          // Optional (null = all years)
        semester: String       // Optional
    },
    readBy: [{
        userId: ObjectId,
        readAt: Date
    }],
    metadata: {                // Type-specific data
        subjectCode, subjectName, semester, year,
        newsId, newsTopic,
        timetableId,
        gpa, level
    },
    createdBy: {
        userId: ObjectId,
        name: String,
        role: String
    },
    isActive: Boolean,
    timestamps: true
}
```

## Notification Flow

### Example: Result Upload
1. Exam division uploads result PDF
2. System parses PDF and creates Result record
3. `createResultNotification()` is called automatically
4. Notification created with:
   - Type: 'result'
   - Recipients: { faculty, year, semester }
   - Metadata: { subjectCode, subjectName }
5. Students of matching faculty/year/semester see notification
6. Clicking notification navigates to Results page

## Read Status Tracking

- Read status is tracked per user using `readBy` array
- When student marks notification as read, their userId is added
- `isReadByUser()` method checks if specific user has read notification
- Frontend can display read/unread badges

## Performance Optimization

1. **Indexed Fields:**
   - recipients.faculty
   - recipients.year
   - type, isActive
   - createdAt (for sorting)

2. **Query Optimization:**
   - Uses `getForUser()` static method
   - Filters at database level
   - Populates related data efficiently
   - Limits results (default 50)

3. **Lean Queries:**
   - Uses `.lean()` for read-only operations
   - Reduces memory overhead
   - Faster response times

## Frontend Integration Points

### Pages to Update
1. **Results.jsx** - Link from result notifications
2. **News.jsx** - Link from news notifications  
3. **ExamTimeTable.jsx** - Link from timetable notifications
4. **GPAAnalytics.jsx** - Link from GPA notifications
5. **Notifications.jsx** - Display all notifications

### Frontend API Calls
```javascript
// Get notifications
GET /api/notifications?limit=50

// Mark as read
PUT /api/notifications/:id/read

// Mark all as read
PUT /api/notifications/read-all

// Get unread count
GET /api/notifications/unread-count
```

## Usage Examples

### Creating Notification from Controller
```javascript
import { createResultNotification } from './notificationController.js';

// After creating result
await createResultNotification({
    faculty: result.faculty,
    year: result.year,
    semester: result.semester,
    subjectCode: result.courseCode,
    subjectName: result.subjectName
}, req.user);
```

### Retrieving Notifications
```javascript
// In frontend
const response = await fetch('/api/notifications', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
const { data } = await response.json();
// data contains only notifications relevant to logged-in student
```

## Security

- All endpoints require authentication (`protect` middleware)
- Students can only see notifications for their faculty/year
- Only admin/examdivision can create custom notifications
- Read status tracked per user securely
- No sensitive data exposed in notifications

## Future Enhancements

1. Real-time notifications using WebSockets
2. Email notifications for urgent updates
3. Push notifications for mobile apps
4. Notification preferences/settings
5. Batch notification creation
6. Scheduled notifications
7. Notification templates
8. Analytics and tracking
