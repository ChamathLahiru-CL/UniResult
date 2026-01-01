import React, { useState, useEffect } from 'react';
import ResultSummary from '../../components/examdivision/results/ResultSummary';
import ResultTable from '../../components/examdivision/results/ResultTable';
import { useAuth } from '../../context/useAuth';

const ResultManagement = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedUser, setSelectedUser] = useState('all');

  // Fetch results from backend
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('http://localhost:5000/api/results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }

        const result = await response.json();

        if (result.success) {
          // Transform backend data to match frontend expectations
          const transformedResults = result.data.map(item => {
            // Extract semester number from semester string (e.g., "1st Semester" -> 1)
            const semesterMatch = item.semester.match(/(\d+)/);
            const semesterNumber = semesterMatch ? parseInt(semesterMatch[1]) : 1;

            return {
              id: item._id,
              subject: item.courseCode
                ? `${item.courseCode} - ${item.subjectName}`
                : item.subjectName,
              degree: item.degreeProgram || `${item.faculty} - ${item.department}`,
              year: item.academicYear || new Date(item.createdAt).getFullYear().toString(),
              semester: semesterNumber,
              uploadedBy: item.uploadedByName || 'Unknown',
              userEmail: item.uploadedByEmail || '',
              count: item.resultCount || 0,
              timestamp: item.createdAt,
              faculty: item.faculty,
              department: item.department,
              level: item.level,
              courseCode: item.courseCode,
              subjectName: item.subjectName,
              fileUrl: item.fileUrl,
              parseStatus: item.parseStatus
            };
          });

          setResults(transformedResults);
        } else {
          setError(result.message || 'Failed to load results');
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleUserFilter = (userId) => {
    setSelectedUser(userId);
  };

  // Get unique users for filter dropdown
  const uniqueUsers = [...new Set(results.map(result => result.uploadedBy))].filter(Boolean);

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Uploaded Results Overview
          </h1>
          <p className="text-slate-500">
            Track all result updates by exam division members
          </p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800 mb-2">
            Uploaded Results Overview
          </h1>
          <p className="text-slate-500">
            Track all result updates by exam division members
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading results
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            value={selectedUser}
          >
            <option value="all">All Users</option>
            <option value="me">My Uploads</option>
            {uniqueUsers.map(userName => (
              <option key={userName} value={userName}>{userName}</option>
            ))}
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