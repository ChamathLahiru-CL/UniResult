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
import './App.css'; // Global CSS styles

// Placeholder components for other dashboards
const ExamDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Exam Division Dashboard</h1>
  </div>
);
const AdminDashboard = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
  </div>
);

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<Login />} /> {/* Login page */}
      <Route path="/signup" element={<SignUp />} /> {/* Sign-up page */}
      <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Forgot password page */}

      {/* Student Dashboard Routes */}
      <Route path="/st-dash" element={<DashboardLayout />}> {/* Dashboard layout */}
        <Route index element={<StudentDashboard />} /> {/* Default student dashboard */}
        <Route path="results" element={<div className="p-8"><h1 className="text-2xl font-bold">Student Results</h1></div>} /> {/* Results page */}
        <Route path="gpa-trend" element={<div className="p-8"><h1 className="text-2xl font-bold">GPA Trend Analysis</h1></div>} /> {/* GPA trend analysis page */}
        <Route path="exam-time-table" element={<ExamTimeTable />} /> {/* Exam timetable page */}
        <Route path="notifications" element={<Notifications />} /> {/* Notifications page */}
        <Route path="profile" element={<Profile />} /> {/* Profile page */}
        <Route path="settings" element={<Profile />} /> {/* Settings page (reuses Profile component) */}
        <Route path="help" element={<Help />} /> {/* Help and support page */}
      </Route>

      {/* Other Dashboard Routes */}
      <Route path="/exam/*" element={<ExamDashboard />} /> {/* Exam division dashboard */}
      <Route path="/admin/*" element={<AdminDashboard />} /> {/* Admin dashboard */}

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to login page */}
    </Routes>
  );
}

export default App;
