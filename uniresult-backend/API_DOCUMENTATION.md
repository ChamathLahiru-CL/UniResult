# User Profile & Settings API Documentation

## Base URL
```
http://localhost:5000/api/user
```

## Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get User Profile
**GET** `/api/user/profile`

Fetches the current user's profile information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "adminId": "ADMIN2024",
    "studentId": "ST2024001",
    "email": "student@std.uwu.ac.lk",
    "firstName": "John",
    "lastName": "Doe",
    "phoneNumber": "+94 77 123 4567",
    "profileImage": "data:image/jpeg;base64,...",
    "username": "ST2024001",
    "enrollmentNumber": "ST2024001",
    "department": "Computer Science",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-11-04T10:00:00.000Z",
    "lastLogin": "2024-11-04T12:00:00.000Z"
  }
}
```

---

### 2. Update Phone Number
**PUT** `/api/user/phone`

Updates the user's phone number.

**Request Body:**
```json
{
  "phoneNumber": "+94 77 123 4567"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Phone number updated successfully",
  "data": {
    "phoneNumber": "+94 77 123 4567"
  }
}
```

---

### 3. Update Profile Image
**PUT** `/api/user/profile-image`

Updates the user's profile image (base64 encoded).

**Request Body:**
```json
{
  "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  }
}
```

---

### 4. Change Password
**PUT** `/api/user/change-password`

Changes the user's password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Current password is incorrect
- `400 Bad Request`: Passwords don't match or validation failed

---

### 5. Delete Account
**DELETE** `/api/user/account`

Permanently deletes the user account.

**Request Body:**
```json
{
  "confirmation": "DELETE"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

### 6. Get User Statistics
**GET** `/api/user/stats`

Fetches user statistics for the dashboard.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalExams": 10,
    "completedExams": 8,
    "averageGPA": 3.75,
    "lastLoginDate": "2024-11-04T12:00:00.000Z"
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## Frontend Integration Examples

### Fetch User Profile
```javascript
const response = await fetch('http://localhost:5000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
```

### Update Phone Number
```javascript
const response = await fetch('http://localhost:5000/api/user/phone', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ phoneNumber: '+94 77 123 4567' })
});
```

### Change Password
```javascript
const response = await fetch('http://localhost:5000/api/user/change-password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    currentPassword: 'old123',
    newPassword: 'new123',
    confirmPassword: 'new123'
  })
});
```

### Delete Account
```javascript
const response = await fetch('http://localhost:5000/api/user/account', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ confirmation: 'DELETE' })
});
```
