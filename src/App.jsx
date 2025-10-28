// Importing necessary libraries and components
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login'; // Login page component
import SignUp from './pages/SignUp'; // Sign-up page component
import ForgotPassword from './pages/ForgotPassword'; // Forgot password page component
import DashboardLayout from './layouts/DashboardLayout'; // Layout for dashboard pages
import StudentDashboard from './pages/dashboard/StudentDashboard'; // Main student dashboard page
import Results from './pages/dashboard/Results'; // Student results page
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
import ExamCompliance from './pages/examdivision/ExamCompliance';
import AdminExamDivisionPage from './pages/admin/AdminExamDivisionPage';
import AdminLayout from './layouts/AdminLayout';
import ExamActivities from './pages/examdivision/ExamActivities';
import ExamDivisionMembers from './pages/examdivision/ExamDivisionMembers';
import ResultManagement from './pages/examdivision/ResultManagement';
import ExamNewsPage from './pages/examdivision/ExamNewsPage';
import ExamTimeTableUploadPage from './pages/examdivision/ExamTimeTableUploadPage';

// Import Admin Compliance components
import AdminCompliancePage from './pages/admin/AdminCompliancePage';
import ComplianceDetailPage from './pages/admin/ComplianceDetailPage';

// Import Admin Student Management components
import AdminStudentManagementPage from './pages/admin/AdminStudentManagementPage';

// Import Admin Recent Activities components
import AdminRecentActivitiesPage from './pages/admin/AdminRecentActivitiesPage';

// Import Admin Student Result Management components
import AdminStudentResultPage from './pages/admin/AdminStudentResultPage';
import ResultDetailsPage from './pages/admin/ResultDetailsPage';

// Import Admin Settings page
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Import Admin Announcement page
import AdminAnnouncementPage from './pages/admin/AdminAnnouncementPage';

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
        <Route path="results" element={<Results />} /> {/* Results page */}
        <Route path="gpa-trend" element={<div className="p-8"><h1 className="text-2xl font-bold">GPA Trend Analysis</h1></div>} /> {/* GPA trend analysis page */}
        <Route path="progress" element={<div className="p-8"><h1 className="text-2xl font-bold">Academic Progress</h1></div>} /> {/* Academic Progress page */}
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
        <Route path="new-result" element={<div className="p-8"><h1 className="text-2xl font-bold">New Result Upload</h1></div>} />
        <Route path="time-table" element={<ExamTimeTableUploadPage />} />
        <Route path="news" element={<ExamNewsPage />} />
        <Route path="compliance" element={<ExamCompliance />} />
        <Route path="activities" element={<ExamActivities />} />
        <Route path="members" element={<ExamDivisionMembers />} />
        <Route path="results" element={<ResultManagement />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Settings</h1></div>} />
        <Route path="help" element={<Help />} />
      </Route>
      
      {/* Admin Dashboard Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
        <Route index element={<AdminDashboard />} /> {/* Default admin dashboard */}
        <Route path="activities" element={<AdminRecentActivitiesPage />} />
        <Route path="exam-division" element={<AdminExamDivisionPage />} />
        <Route path="exam-division/:memberId" element={<AdminExamDivisionPage />} />
        <Route path="compliance" element={<AdminCompliancePage />} />
        <Route path="compliance/:id" element={<ComplianceDetailPage />} />
        <Route path="students" element={<AdminStudentManagementPage />} />
        <Route path="results" element={<AdminStudentResultPage />} />
        <Route path="results/:id" element={<ResultDetailsPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="announcement" element={<AdminAnnouncementPage />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} /> {/* Redirect unknown routes to login page */}
    </Routes>
    </AuthProvider>
  );
}

export default App;
