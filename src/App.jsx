import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ForgotPassword from './pages/ForgotPassword'
import DashboardLayout from './layouts/DashboardLayout'
import StudentDashboard from './pages/dashboard/StudentDashboard'
import ExamTimeTable from './pages/dashboard/ExamTimeTable'
import Notifications from './pages/dashboard/Notifications'
import Profile from './pages/dashboard/Profile'
import Help from './pages/dashboard/Help'
import './App.css'

const ExamDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Exam Division Dashboard</h1></div>;
const AdminDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1></div>;

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Student Dashboard Routes */}
      <Route path="/dash" element={<DashboardLayout />}>
        <Route index element={<StudentDashboard />} />
        <Route path="results" element={<div className="p-8"><h1 className="text-2xl font-bold">Student Results</h1></div>} />
        <Route path="gpa-trend" element={<div className="p-8"><h1 className="text-2xl font-bold">GPA Trend Analysis</h1></div>} />
        <Route path="exam-time-table" element={<ExamTimeTable />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Profile />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Other Dashboard Routes */}
      <Route path="/exam/*" element={<ExamDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
