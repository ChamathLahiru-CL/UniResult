// Importing necessary libraries and components
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Login page component
import SignUp from './pages/SignUp'; // Sign-up page component
import ForgotPassword from './pages/ForgotPassword'; // Forgot password page component
import DashboardLayout from './layouts/DashboardLayout'; // Layout for dashboard pages
import StudentDashboard from './pages/dashboard/StudentDashboard'; // Main student dashboard page
import ExamTimeTable from './pages/dashboard/ExamTimeTable'; // Exam timetable page
import Notifications from './pages/dashboard/Notifications'; // Notifications page
import Profile from './pages/dashboard/Profile'; // Profile page
import Help from './pages/dashboard/Help'; // Help and support page
import AdminDashboard from './pages/admin/AdminDashboard'; // Admin dashboard page
import { AuthProvider } from './context/AuthContext.jsx'; // Auth context provider
import ProtectedRoute from './components/ProtectedRoute'; // Protected route component
import './App.css'; // Global CSS styles

// Import Exam Division components
import ExamDivision from './pages/examdivision/ExamDivision';
import ExamDivisionLayout from './layouts/ExamDivisionLayout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Authentication Routes */}
      <Route path="/" element={<Login />} /> {/* Login page */}
      <Route path="/signup" element={<SignUp />} /> {/* Sign-up page */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password page */}

      {/* Student Dashboard Routes */}
      <Route 
        path="/dash" 
        element={
          <ProtectedRoute requiredRole="student">
            <DashboardLayout />
          </ProtectedRoute>
        }>
        <Route index element={<StudentDashboard />} /> {/* Default student dashboard */}
        <Route path="results" element={<div className="p-8"><h1 className="text-2xl font-bold">Student Results</h1></div>} /> {/* Results page */}
        <Route path="gpa-trend" element={<div className="p-8"><h1 className="text-2xl font-bold">GPA Trend Analysis</h1></div>} /> {/* GPA trend analysis page */}
        <Route path="exam-time-table" element={<ExamTimeTable />} /> {/* Exam timetable page */}
        <Route path="notifications" element={<Notifications />} /> {/* Notifications page */}
        <Route path="profile" element={<Profile />} /> {/* Profile page */}
        <Route path="settings" element={<Profile />} /> {/* Settings page (reuses Profile component) */}
        <Route path="help" element={<Help />} /> {/* Help and support page */}
      </Route>

      {/* Exam Division Dashboard Routes */}
      <Route
        path="/exam"
        element={
          <ProtectedRoute requiredRole="examDiv">
            <ExamDivisionLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExamDivision />} />
        <Route path="update-result" element={<div className="p-8"><h1 className="text-2xl font-bold">Update Result</h1></div>} />
        <Route path="new-result" element={<div className="p-8"><h1 className="text-2xl font-bold">New Result Upload</h1></div>} />
        <Route path="time-table" element={<div className="p-8"><h1 className="text-2xl font-bold">Time Table Update</h1></div>} />
        <Route path="news" element={<div className="p-8"><h1 className="text-2xl font-bold">News Upload</h1></div>} />
        <Route path="compliance" element={<div className="p-8"><h1 className="text-2xl font-bold">Student Compliance</h1></div>} />
        <Route path="activities" element={<div className="p-8"><h1 className="text-2xl font-bold">Recent Activities</h1></div>} />
        <Route path="division" element={<div className="p-8"><h1 className="text-2xl font-bold">Exam Division</h1></div>} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
        <Route path="help" element={<Help />} />
      </Route>
      
      {/* Admin Dashboard Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }>
        <Route index element={<AdminDashboard />} /> {/* Default admin dashboard */}
        <Route path="update-result" element={<div className="p-8"><h1 className="text-2xl font-bold">Update Result</h1></div>} />
        <Route path="activities" element={<div className="p-8"><h1 className="text-2xl font-bold">Recent Activities</h1></div>} />
        <Route path="exam-division" element={<div className="p-8"><h1 className="text-2xl font-bold">Exam Division</h1></div>} />
        <Route path="students" element={<div className="p-8"><h1 className="text-2xl font-bold">Students Management</h1></div>} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to login page */}
    </Routes>
    </AuthProvider>
  );
}

export default App;
