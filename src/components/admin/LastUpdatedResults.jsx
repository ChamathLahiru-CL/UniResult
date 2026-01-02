import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon, EyeIcon } from '@heroicons/react/24/outline';

const LastUpdatedResults = () => {
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const RESULTS_LIMIT = 5; // Only show 5 latest results

  // Fetch recent results from API
  useEffect(() => {
    const fetchRecentResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/results?limit=${RESULTS_LIMIT}&sort=-updatedAt`, {
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
          // Transform backend data to match component expectations
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
              year: item.academicYear || new Date(item.updatedAt).getFullYear().toString(),
              semester: semesterNumber,
              uploadedBy: {
                name: item.uploadedByName || 'Unknown User',
                id: item.uploadedByUsername || 'Unknown',
                memberId: item.uploadedBy?._id?.toString() || 'Unknown',
                email: item.uploadedByEmail || 'unknown@example.com',
                department: item.department || 'Unknown'
              },
              statistics: {
                totalStudents: item.resultCount || 0,
                passedStudents: 0,
                failedStudents: 0,
                averageGrade: 0,
                highestGrade: 0,
                lowestGrade: 0
              },
              status: item.parseStatus || 'pending',
              fileSize: 'Unknown',
              uploadTime: 'Unknown',
              date: item.updatedAt,
              faculty: item.faculty,
              department: item.department,
              level: parseInt(item.level) || 100,
              courseCode: item.courseCode,
              subjectName: item.subjectName,
              fileUrl: item.fileUrl,
              parseStatus: item.parseStatus,
              isDeleted: item.isDeleted || false,
              deletedAt: item.deletedAt,
              deletedBy: item.deletedByName,
              deletedByUsername: item.deletedByUsername
            };
          });

          // Strictly enforce 5 results limit
          const limitedResults = transformedResults.slice(0, RESULTS_LIMIT);
          setRecentUploads(limitedResults);
          console.log(`Loaded ${limitedResults.length} of ${transformedResults.length} results (limited to ${RESULTS_LIMIT})`);
        } else {
          setError(result.message || 'Failed to load results');
        }
      } catch (err) {
        console.error('Error fetching recent results:', err);
        setError(err.message || 'Failed to load results');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentResults();

    // Auto-refresh every 30 seconds to show latest updates
    const refreshInterval = setInterval(() => {
      fetchRecentResults();
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'text-green-600 bg-green-50',
      'processing': 'text-blue-600 bg-blue-50',
      'pending': 'text-yellow-600 bg-yellow-50',
      'failed': 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Latest Updated Results</h2>
          <Link 
            to="/admin/results" 
            className="inline-flex items-center text-[#246BFD] hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All Results
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Latest Updated Results</h2>
          <Link 
            to="/admin/results" 
            className="inline-flex items-center text-[#246BFD] hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View All Results
            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header with link to full results page */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Latest Updated Results</h2>
        <Link 
          to="/admin/results" 
          className="inline-flex items-center text-[#246BFD] hover:text-blue-700 font-medium text-sm transition-colors"
        >
          View All Results
          <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentUploads.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="text-sm text-gray-500">
                      No result uploads have been made yet.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              recentUploads.map((upload) => (
                <tr key={upload.id} className={`${upload.isDeleted ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(upload.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${upload.isDeleted ? 'line-through text-red-700' : 'text-gray-900'}`}>
                      {upload.subject}
                    </div>
                    <div className="text-sm text-gray-500">Semester {upload.semester}</div>
                    {upload.isDeleted && (
                      <div className="text-xs text-red-600 mt-1">
                        Deleted by Admin
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={upload.isDeleted ? 'line-through text-red-700' : ''}>
                      {upload.degree}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={upload.isDeleted ? 'line-through text-red-700' : ''}>
                      Level {upload.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {upload.isDeleted ? (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Deleted
                      </span>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(upload.status)}`}>
                        {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link
                      to={`/admin/results/${upload.id}`}
                      className="inline-flex items-center text-[#246BFD] text-sm border border-[#246BFD] px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer note */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing latest 5 updated result uploads
      </div>
    </div>
  );
};

export default LastUpdatedResults;
