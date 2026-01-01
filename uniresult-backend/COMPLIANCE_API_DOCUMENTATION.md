# Compliance Management API Documentation

## Overview
This document describes the API endpoints for the compliance management system, specifically designed for Exam Division staff to manage student compliances.

## Base URL
```
http://localhost:5000/api/compliance
```

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Exam Division Endpoints

### 1. Get Exam Division Compliances
**Endpoint:** `GET /exam-division/list`  
**Access:** Exam Division, Admin  
**Description:** Retrieve all compliances sent to the Exam Division with filtering and search capabilities.

**Query Parameters:**
- `status` (optional): Filter by status (pending, in-progress, resolved, closed)
- `importance` (optional): Filter by importance (High, Medium, Low)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in student name, index number, topic, or message

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "student": "64a1b2c3d4e5f6g7h8i9j0k2",
      "studentName": "John Doe",
      "studentEmail": "john@example.com",
      "studentIndexNumber": "ENG/2023/101",
      "topic": "Missing Final Marks",
      "recipient": "Exam Division",
      "importance": "High",
      "message": "Final marks not showing...",
      "selectedGroups": ["Exam Division"],
      "attachments": [...],
      "status": "pending",
      "isRead": false,
      "readBy": [],
      "createdAt": "2024-01-01T10:00:00.000Z",
      "updatedAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "stats": {
    "total": 25,
    "pending": 10,
    "inProgress": 8,
    "resolved": 5,
    "closed": 2,
    "unread": 12,
    "high": 5,
    "medium": 8,
    "low": 7
  },
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

---

### 2. Mark Compliance as Read
**Endpoint:** `POST /:id/read`  
**Access:** Exam Division, Admin  
**Description:** Mark a compliance as read and add the current user to the readBy array.

**URL Parameters:**
- `id`: Compliance ID

**Response:**
```json
{
  "success": true,
  "message": "Compliance marked as read",
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "isRead": true,
    "readBy": ["64a1b2c3d4e5f6g7h8i9j0k3"],
    ...
  }
}
```

---

### 3. Download Compliance as PDF
**Endpoint:** `GET /:id/pdf`  
**Access:** All authenticated users  
**Description:** Generate and download a comprehensive PDF document containing all compliance details.

**URL Parameters:**
- `id`: Compliance ID

**Response:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=compliance-{id}.pdf`

**PDF Contents:**
- Reference ID
- Student Information (Name, Index Number, Email)
- Compliance Details (Topic, Recipient, Importance, Status, Submission Date)
- Full Message
- List of Attachments
- Admin Response (if available)
- Read Status
- Generation Timestamp

---

## Existing Endpoints

### 4. Submit Compliance
**Endpoint:** `POST /`  
**Access:** Student  
**Description:** Submit a new compliance with optional file attachments.

**Request Body (multipart/form-data):**
- `topic`: String (required)
- `recipient`: String (required)
- `importance`: String (required) - "High", "Medium", or "Low"
- `message`: String (required)
- `selectedGroups`: JSON string array (required)
- `attachments`: Files (optional, max 5 files, 10MB each)

**Allowed File Types:** PNG, JPG, PDF, TXT, DOCX

---

### 5. Get My Compliances
**Endpoint:** `GET /my`  
**Access:** Student  
**Description:** Retrieve all compliances submitted by the logged-in student.

**Query Parameters:**
- `status` (optional): Filter by status
- `importance` (optional): Filter by importance
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

---

### 6. Get All Compliances (Admin)
**Endpoint:** `GET /`  
**Access:** Admin, Exam Division  
**Description:** Retrieve all compliances across the system with statistics.

**Query Parameters:**
- `status` (optional): Filter by status
- `importance` (optional): Filter by importance
- `recipient` (optional): Filter by recipient
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

---

### 7. Get Single Compliance
**Endpoint:** `GET /:id`  
**Access:** All authenticated users (with authorization check)  
**Description:** Retrieve detailed information about a single compliance.

**Authorization:**
- Students can only view their own compliances
- Admin and Exam Division can view all compliances

---

### 8. Update Compliance Status
**Endpoint:** `PUT /:id/status`  
**Access:** Admin, Exam Division  
**Description:** Update the status of a compliance and optionally add a response.

**Request Body:**
```json
{
  "status": "in-progress",
  "responseMessage": "We are investigating your concern..."
}
```

---

### 9. Delete Compliance
**Endpoint:** `DELETE /:id`  
**Access:** Admin only  
**Description:** Delete a compliance and all associated files.

---

### 10. Download Attachment
**Endpoint:** `GET /:id/attachment/:attachmentId`  
**Access:** All authenticated users  
**Description:** Download a specific attachment file from a compliance.

---

## Status Values
- `pending`: Initial state when submitted
- `in-progress`: Being reviewed/processed
- `resolved`: Issue has been resolved
- `closed`: Compliance has been closed

## Importance Levels
- `High`: Urgent issues requiring immediate attention
- `Medium`: Standard priority issues
- `Low`: Minor issues or inquiries

## Recipient Options
- `Admin`: General administration
- `Exam Division`: Exam-related issues
- `Exam Center`: Examination center concerns

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to view this compliance"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Compliance not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error fetching compliances",
  "error": "Detailed error message"
}
```

---

## Frontend Integration Examples

### Fetch Exam Division Compliances
```javascript
const fetchCompliances = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    'http://localhost:5000/api/compliance/exam-division/list',
    {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        page: 1,
        limit: 10,
        status: 'pending',
        search: 'marks'
      }
    }
  );
  return response.data;
};
```

### Mark as Read
```javascript
const markAsRead = async (complianceId) => {
  const token = localStorage.getItem('token');
  await axios.post(
    `http://localhost:5000/api/compliance/${complianceId}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
```

### Download PDF
```javascript
const downloadPDF = async (complianceId) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(
    `http://localhost:5000/api/compliance/${complianceId}/pdf`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    }
  );
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `compliance-${complianceId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
```

---

## Database Model

### Compliance Schema
```javascript
{
  student: ObjectId (ref: 'User'),
  studentName: String,
  studentEmail: String,
  studentIndexNumber: String,
  topic: String,
  recipient: String,
  importance: String (enum: ['High', 'Medium', 'Low']),
  message: String,
  selectedGroups: [String],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    url: String
  }],
  status: String (enum: ['pending', 'in-progress', 'resolved', 'closed']),
  response: {
    message: String,
    respondedBy: ObjectId,
    respondedByName: String,
    respondedAt: Date
  },
  isRead: Boolean (default: false),
  readBy: [ObjectId],
  timestamps: true
}
```

### Indexes
- `{ student: 1, createdAt: -1 }`
- `{ recipient: 1, status: 1 }`
- `{ importance: 1, status: 1 }`

---

## Notes
- All file uploads are stored in `/public/uploads/compliance/`
- Maximum file size: 10MB per file
- Maximum 5 files per compliance
- PDF generation includes all compliance details and admin responses
- Read status is tracked per user in the `readBy` array
- Statistics are calculated in real-time based on current data
