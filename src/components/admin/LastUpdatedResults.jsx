import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { mockResultUploads } from '../../data/mockResultUploads';

const LastUpdatedResults = () => {
  // Get the last 7 result uploads from the Student Result Management data
  const recentUploads = mockResultUploads.slice(0, 7);

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'text-green-600 bg-green-50',
      'processing': 'text-blue-600 bg-blue-50',
      'pending': 'text-yellow-600 bg-yellow-50',
      'failed': 'text-red-600 bg-red-50'
    };
    return colors[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header with link to full results page */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Last Updated Results</h2>
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
            {recentUploads.map((upload) => (
              <tr key={upload.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(upload.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{upload.subject}</div>
                  <div className="text-sm text-gray-500">Semester {upload.semester}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {upload.degree}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  Level {upload.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(upload.status)}`}>
                    {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
                  </span>
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
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer note */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Showing {recentUploads.length} most recent result uploads
      </div>
    </div>
  );
};

export default LastUpdatedResults;
