import React, { useState } from 'react';
import { format } from 'date-fns';
import { getSemesterColor } from '../../../utils/getSemesterColor';
import ResultDetailModal from './ResultDetailModal';
import { EyeIcon } from '@heroicons/react/24/outline';

const ResultTable = ({ results, currentUser, searchQuery, dateRange, selectedUser }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter results based on search query and filters
  const filteredResults = results.filter(result => {
    const matchesSearch = searchQuery
      ? result.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.degree.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDate = dateRange.start && dateRange.end
      ? new Date(result.timestamp) >= new Date(dateRange.start) &&
        new Date(result.timestamp) <= new Date(dateRange.end)
      : true;

    const matchesUser = selectedUser === 'all'
      ? true
      : selectedUser === 'me'
        ? result.uploadedBy === currentUser.name
        : result.uploadedBy === selectedUser;

    return matchesSearch && matchesDate && matchesUser;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Degree
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Uploaded By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResults.map((result) => {
              const isCurrentUser = result.uploadedBy === currentUser.name;
              return (
                <tr
                  key={result.id}
                  className={`${
                    isCurrentUser ? 'bg-green-50' : 'odd:bg-white even:bg-gray-50'
                  } hover:bg-blue-50 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-700">{result.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.degree}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs text-white rounded-full ${getSemesterColor(result.semester)}`}>
                      Semester {result.semester}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="group relative">
                      <span className={`text-sm ${isCurrentUser ? 'font-semibold text-green-600' : 'text-gray-900'}`}>
                        {result.uploadedBy}
                      </span>
                      {/* Tooltip */}
                      <div className="hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-sm bg-gray-900 text-white rounded-md shadow-lg">
                        <p className="font-medium">{result.uploadedBy}</p>
                        <p className="text-gray-300">{result.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(result.timestamp), 'MMM d, yyyy – h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${result.count > 50 ? 'bg-yellow-100 text-yellow-800' : 
                          result.count < 10 ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {result.count} Results
                      </span>
                      <button
                        onClick={() => {
                          setSelectedResult(result);
                          setIsModalOpen(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-200">
        {filteredResults.map((result) => {
          const isCurrentUser = result.uploadedBy === currentUser.name;
          return (
            <div
              key={result.id}
              className={`p-4 ${isCurrentUser ? 'bg-green-50' : 'bg-white'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-blue-700">{result.subject}</div>
                <span className={`px-2 py-1 text-xs text-white rounded-full ${getSemesterColor(result.semester)}`}>
                  Semester {result.semester}
                </span>
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>
                  {result.degree} • Year {result.year}
                </div>
                <div className="flex justify-between items-center">
                  <span className={isCurrentUser ? 'text-green-600 font-medium' : ''}>
                    {result.uploadedBy}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${result.count > 50 ? 'bg-yellow-100 text-yellow-800' : 
                        result.count < 10 ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}
                    >
                      {result.count} Results
                    </span>
                    <button
                      onClick={() => {
                        setSelectedResult(result);
                        setIsModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(result.timestamp), 'MMM d, yyyy – h:mm a')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Result Detail Modal */}
      <ResultDetailModal
        result={selectedResult}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedResult(null);
        }}
      />
    </div>
  );
};

export default ResultTable;