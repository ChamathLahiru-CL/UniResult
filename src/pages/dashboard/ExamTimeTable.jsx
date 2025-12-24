import React, { useState, useEffect } from 'react';

/**
 * ExamTimeTable Component
 * Displays examination schedules for different levels
 */
const ExamTimeTable = () => {
  const [timeTables, setTimeTables] = useState([]);
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
        setTimeTables(result.data);
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

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = timeTable.originalFileName || `${timeTable.faculty}_${timeTable.year}_timetable.${timeTable.fileType}`;

      // Append to document, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download timetable. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="animate-fadeIn p-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fadeIn p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTimeTables}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn p-4">
      {/* Page Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Examination Time Tables
        </h1>
        <p className="text-gray-500 text-sm">
          All examination schedules for your faculty - Academic year 2024/2025
        </p>
        {studentInfo && (
          <div className="mt-2 text-sm text-gray-600">
            <p><strong>Faculty:</strong> {studentInfo.faculty}</p>
            {studentInfo.year && <p><strong>Year:</strong> {studentInfo.year}</p>}
          </div>
        )}
      </div>

      {/* Timetables List - Grouped by Year */}
      <div className="space-y-8">
        {timeTables.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No timetables available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Time tables for your faculty will be uploaded soon.
              </p>
            </div>
          </div>
        ) : (
          // Group timetables by year
          Object.entries(
            timeTables.reduce((acc, timeTable) => {
              if (!acc[timeTable.year]) {
                acc[timeTable.year] = [];
              }
              acc[timeTable.year].push(timeTable);
              return acc;
            }, {})
          )
          .sort(([a], [b]) => {
            // Sort years: 1st Year, 2nd Year, 3rd Year, 4th Year
            const yearOrder = { '1st Year': 1, '2nd Year': 2, '3rd Year': 3, '4th Year': 4 };
            return yearOrder[a] - yearOrder[b];
          })
          .map(([year, yearTimeTables]) => (
            <div key={year} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                {year} Examination Time Tables
              </h2>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {yearTimeTables.map((timeTable) => (
                  <div key={timeTable._id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {timeTable.faculty} - {timeTable.year}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Uploaded by {timeTable.uploadedBy?.name || timeTable.uploadedByName || 'Unknown'} on {new Date(timeTable.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          File: {timeTable.originalFileName} ({(timeTable.fileSize / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownload(timeTable)}
                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-95 active:scale-[0.98] transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </button>
                    </div>

                    {/* File Preview */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {timeTable.fileType === 'pdf' ? (
                        <div className="bg-gray-100 p-8 text-center">
                          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">PDF Document</p>
                          <p className="text-xs text-gray-500">Click download to view</p>
                        </div>
                      ) : (
                        <img
                          src={`http://localhost:5000${timeTable.fileUrl}`}
                          alt={`${timeTable.faculty} ${timeTable.year} timetable`}
                          className="w-full h-auto max-h-96 object-contain"
                          onError={(e) => {
                            e.target.src = '/placeholder-timetable.png';
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamTimeTable;