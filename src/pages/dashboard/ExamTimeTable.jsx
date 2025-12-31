import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  AcademicCapIcon,
  ChevronRightIcon,
  SparklesIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

/**
 * ExamTimeTable Component
 * Displays latest examination schedules for different levels with modern design
 */
const ExamTimeTable = () => {
  const navigate = useNavigate();
  const [latestTimeTables, setLatestTimeTables] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);

  useEffect(() => {
    fetchTimeTables();
  }, []);

  const fetchTimeTables = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/timetable/student', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch timetables');
      }

      const result = await response.json();

      if (result.success) {
        // Group by year and get only the latest for each year
        const grouped = result.data.reduce((acc, timeTable) => {
          if (!acc[timeTable.year] || new Date(timeTable.createdAt) > new Date(acc[timeTable.year].createdAt)) {
            acc[timeTable.year] = timeTable;
          }
          return acc;
        }, {});
        
        setLatestTimeTables(grouped);
        setStudentInfo(result.studentInfo);
      } else {
        setError(result.message || 'Failed to load timetables');
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
      setError(error.message || 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (timeTable) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/timetable/${timeTable._id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = timeTable.originalFileName || `${timeTable.faculty}_${timeTable.year}_timetable.${timeTable.fileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download timetable. Please try again.');
    }
  };

  const handleView = (timeTable) => {
    // Open the timetable in a new tab
    const fileUrl = `http://localhost:5000${timeTable.fileUrl}`;
    window.open(fileUrl, '_blank');
  };

  const handleViewAllYearTimetables = (year) => {
    navigate(`/dash/exam-time-table/${year}`, { state: { year } });
  };

  const getYearColor = () => {
    return { 
      gradient: 'from-blue-400 to-indigo-500', 
      bg: 'from-blue-50 to-indigo-50', 
      border: 'border-blue-200', 
      icon: 'text-blue-600' 
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading timetables...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Timetables</h3>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTimeTables}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const yearOrder = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <CalendarIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Examination Timetables</h1>
                  <p className="text-blue-100 text-sm sm:text-base mt-1">Academic Year 2024/2025</p>
                </div>
              </div>
              {studentInfo && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-white">
                    <p className="text-xs text-blue-100">Your Faculty</p>
                    <p className="font-bold text-lg">{studentInfo.faculty}</p>
                    {studentInfo.year && <p className="text-sm text-blue-100 mt-1">{studentInfo.year}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-blue-50 border-t border-blue-100 p-4">
            <div className="flex items-center space-x-2 text-blue-700">
              <SparklesIcon className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Showing latest timetable for each year. Click "View All" to see past timetables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Timetables Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {yearOrder.map((year) => {
            const timeTable = latestTimeTables[year];
            const colors = getYearColor();
            
            if (!timeTable) {
              // No timetable available for this year
              return (
                <div
                  key={year}
                  className="group bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                          <AcademicCapIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-white">{year}</h2>
                          <p className="text-white/90 text-sm">Latest Timetable</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  <div className="p-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Timetable Yet</h3>
                    <p className="text-gray-500 text-sm">
                      The examination timetable for {year} hasn't been uploaded yet.
                    </p>
                  </div>
                </div>
              );
            }
            
            return (
              <div
                key={year}
                className="group bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                        <AcademicCapIcon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">{year}</h2>
                        <p className="text-white/90 text-sm">Latest Timetable</p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-semibold">NEW</span>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <ClockIcon className={`h-4 w-4 ${colors.icon}`} />
                        <p className="text-xs text-gray-600 font-medium">Updated</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{formatDate(timeTable.createdAt)}</p>
                    </div>
                    <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <AcademicCapIcon className={`h-4 w-4 ${colors.icon}`} />
                        <p className="text-xs text-gray-600 font-medium">Faculty</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {timeTable.faculty}
                      </p>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">File Name</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{timeTable.originalFileName}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Uploaded by {timeTable.uploadedBy?.name || timeTable.uploadedByName || 'Admin'}
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="mb-6 border-2 border-gray-200 rounded-xl overflow-hidden">
                    {timeTable.fileType === 'pdf' ? (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-12 text-center">
                        <svg className="mx-auto h-16 w-16 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm font-semibold text-gray-700">PDF Document</p>
                        <p className="text-xs text-gray-500 mt-1">Download to view full timetable</p>
                      </div>
                    ) : (
                      <img
                        src={`http://localhost:5000${timeTable.fileUrl}`}
                        alt={`${year} timetable`}
                        className="w-full h-auto max-h-64 object-contain bg-gray-50"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      onClick={() => handleView(timeTable)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-blue-300 text-blue-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium active:scale-95"
                    >
                      <EyeIcon className="h-5 w-5" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownload(timeTable)}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium shadow-lg active:scale-95`}
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => handleViewAllYearTimetables(year)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-medium active:scale-95"
                    >
                      <span>History</span>
                      <ChevronRightIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamTimeTable;