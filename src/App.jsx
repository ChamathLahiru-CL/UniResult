import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import './App.css'

// Placeholder dashboard components
const StudentDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Student Dashboard</h1></div>;
const ExamDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Exam Division Dashboard</h1></div>;
const AdminDashboard = () => <div className="p-8"><h1 className="text-2xl font-bold">Admin Dashboard</h1></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/student/*" element={<StudentDashboard />} />
      <Route path="/exam/*" element={<ExamDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
