import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

/**
 * YearTimetables Component
 * Displays all timetables for a specific year
 */
const YearTimetables = () => {
  const { year } = useParams();
  const navigate = useNavigate();
  const [timeTables, setTimeTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchYearTimetables = useCallback(async () => {
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
        // Filter and sort timetables for this year (newest first)
        const yearTimetables = result.data
          .filter(tt => tt.year === year)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setTimeTables(yearTimetables);
      } else {
        setError(result.message || 'Failed to load timetables');
      }
    } catch (error) {
      console.error('Error fetching timetables:', error);
      setError(error.message || 'Failed to load timetables');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchYearTimetables();
  }, [fetchYearTimetables]);

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
    const fileUrl = `http://localhost:5000${timeTable.fileUrl}`;
    window.open(fileUrl, '_blank');
  };

  const getYearColor = () => {
    return { 
      gradient: 'from-blue-500 to-indigo-600', 
      bg: 'bg-blue-50', 
      border: 'border-blue-200', 
      text: 'text-blue-700' 
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const colors = getYearColor();

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
          <button
            onClick={() => navigate('/dash/exam-time-table')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Timetables</span>
          </button>
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchYearTimetables}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dash/exam-time-table')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200 group"
        >
          <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-medium">Back to All Timetables</span>
        </button>

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${colors.gradient} p-6 sm:p-8`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{year}</h1>
                  <p className="text-white/90 text-sm sm:text-base mt-1">All Examination Timetables</p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <p className="text-white text-sm">Total: <span className="font-bold text-lg">{timeTables.length}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Timetables List */}
        {timeTables.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <DocumentTextIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Timetables Found</h3>
              <p className="text-gray-500">
                No examination timetables have been uploaded for {year} yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {timeTables.map((timeTable, index) => (
              <div
                key={timeTable._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Preview */}
                    <div className="lg:w-1/3">
                      <div className="border-2 border-gray-200 rounded-xl overflow-hidden">
                        {timeTable.fileType === 'pdf' ? (
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12 text-center aspect-square flex flex-col items-center justify-center">
                            <svg className="h-16 w-16 sm:h-20 sm:w-20 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-700">PDF Document</p>
                            <p className="text-xs text-gray-500 mt-1">Click download to view</p>
                          </div>
                        ) : (
                          <img
                            src={`http://localhost:5000${timeTable.fileUrl}`}
                            alt={`${year} timetable`}
                            className="w-full h-auto object-contain bg-gray-50"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:w-2/3 flex flex-col justify-between">
                      {/* Header with Badge */}
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                              {timeTable.faculty} - {timeTable.year}
                            </h3>
                            {index === 0 && (
                              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                <CheckCircleIcon className="h-4 w-4" />
                                <span>Latest</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <CalendarIcon className={`h-5 w-5 ${colors.text}`} />
                              <p className="text-xs text-gray-600 font-medium">Upload Date</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{formatDate(timeTable.createdAt)}</p>
                          </div>
                          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border}`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <AcademicCapIcon className={`h-5 w-5 ${colors.text}`} />
                              <p className="text-xs text-gray-600 font-medium">Faculty</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {timeTable.faculty}
                            </p>
                          </div>
                        </div>

                        {/* File Info */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">File Name</p>
                          <p className="text-sm font-medium text-gray-900 break-all">{timeTable.originalFileName}</p>
                          <p className="text-xs text-gray-500 mt-3">
                            Uploaded by <span className="font-semibold">{timeTable.uploadedBy?.name || timeTable.uploadedByName || 'Admin'}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleView(timeTable)}
                          className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-blue-300 text-blue-700 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium active:scale-95"
                        >
                          <EyeIcon className="h-5 w-5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(timeTable)}
                          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium shadow-lg active:scale-95`}
                        >
                          <ArrowDownTrayIcon className="h-5 w-5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default YearTimetables;
