import React, { useState } from 'react';
import ResultSummary from '../../components/examdivision/results/ResultSummary';
import ResultTable from '../../components/examdivision/results/ResultTable';
import { useAuth } from '../../context/useAuth';

const ResultManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedUser, setSelectedUser] = useState('all');

  // Sample data - Replace with API call
  const results = [
    {
      id: 1,
      subject: "ICT1213 - Database Management Systems",
      degree: "ICT",
      year: 2025,
      semester: 2,
      uploadedBy: "Lahiru Jayasooriya",
      userEmail: "lahiru@exam.university.edu",
      count: 42,
      timestamp: "2025-10-18T10:35:00Z"
    },
    {
      id: 2,
      subject: "ICT1223 - Web Technologies",
      degree: "ICT",
      year: 2025,
      semester: 2,
      uploadedBy: "Sarah Johnson",
      userEmail: "sarah.j@exam.university.edu",
      count: 38,
      timestamp: "2025-10-17T14:20:00Z"
    },
    // Add more sample data...
  ];

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleUserFilter = (userId) => {
    setSelectedUser(userId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Uploaded Results Overview
        </h1>
        <p className="text-slate-500">
          Track all result updates by exam division members
        </p>
      </div>

      {/* Summary Widgets */}
      <ResultSummary results={results} />

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div>
          <input
            type="text"
            placeholder="Search by subject or degree..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Date Range Filter */}
        <div className="flex space-x-2">
          <input
            type="date"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleDateRangeChange({ ...dateRange, start: e.target.value })}
          />
          <input
            type="date"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleDateRangeChange({ ...dateRange, end: e.target.value })}
          />
        </div>

        {/* User Filter */}
        <div>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => handleUserFilter(e.target.value)}
          >
            <option value="all">All Users</option>
            <option value="me">My Uploads</option>
            {/* Add more users dynamically */}
          </select>
        </div>
      </div>

      {/* Results Table */}
      <ResultTable
        results={results}
        currentUser={user}
        searchQuery={searchQuery}
        dateRange={dateRange}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default ResultManagement;