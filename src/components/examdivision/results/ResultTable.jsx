import React, { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { format } from 'date-fns';
import { getSemesterColor } from '../../../utils/getSemesterColor';
import ResultDetailModal from './ResultDetailModal';
import { EyeIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ResultTable = forwardRef(({ results, currentUser, searchQuery, selectedFaculty, selectedDepartment, selectedUser }, ref) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableScrollRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollLeft: () => {
      if (tableScrollRef.current) {
        tableScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      }
    },
    scrollRight: () => {
      if (tableScrollRef.current) {
        tableScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }
  }));

  // Scroll functions
  const scrollLeft = useCallback(() => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }, []);

  const scrollRight = useCallback(() => {
    if (tableScrollRef.current) {
      tableScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollLeft();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollRight();
    }
  }, [scrollLeft, scrollRight]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Only handle keyboard navigation when table is in view and focused
      if (tableScrollRef.current && tableScrollRef.current.contains(document.activeElement)) {
        handleKeyDown(e);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleKeyDown]);

  // Filter results based on search query and filters
  const filteredResults = results.filter(result => {
    const matchesSearch = searchQuery
      ? result.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.faculty.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesFaculty = selectedFaculty === 'all' || !selectedFaculty
      ? true
      : result.faculty === selectedFaculty;

    const matchesDepartment = selectedDepartment === 'all' || !selectedDepartment
      ? true
      : result.department === selectedDepartment;

    const matchesUser = selectedUser === 'all'
      ? true
      : selectedUser === 'me'
        ? result.uploadedBy === currentUser.name
        : result.uploadedBy === selectedUser;

    return matchesSearch && matchesFaculty && matchesDepartment && matchesUser;
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden relative">
      {/* Desktop View */}
      <div className="hidden md:block relative">

        {/* Fade indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none z-5"></div>
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-5"></div>

        <div ref={tableScrollRef} className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" tabIndex={0}>
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                Subject
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                Degree Program
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                Faculty Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                Year
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Semester
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0">
                Uploaded By
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Date & Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Count
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="text-sm text-gray-500">
                      {results.length === 0 
                        ? "No result uploads have been made yet." 
                        : "Try adjusting your search or filter criteria."
                      }
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredResults.map((result, index) => {
                const isCurrentUser = result.uploadedBy === currentUser.name;
                const rowClassName = result.isDeleted 
                  ? 'bg-red-50 border-red-200 hover:bg-red-100'
                  : isCurrentUser 
                    ? 'bg-green-50 hover:bg-blue-50' 
                    : 'odd:bg-white even:bg-gray-50 hover:bg-blue-50';
                
                return (
                  <tr
                    key={result.id}
                    className={`${rowClassName} transition-colors duration-150 border-b`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-medium truncate max-w-xs ${result.isDeleted ? 'line-through text-red-700' : 'text-blue-700'}`}>
                        {result.subject}
                      </div>
                      {result.isDeleted && (
                        <div className="text-xs text-red-600 mt-1">
                          ❌ Deleted by Admin
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className={`truncate max-w-xs ${result.isDeleted ? 'line-through text-red-700' : ''}`}>
                        {result.degree}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className={`truncate max-w-xs ${result.isDeleted ? 'line-through text-red-700' : ''}`}>
                        {result.faculty}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={result.isDeleted ? 'line-through text-red-700' : ''}>
                        {result.year}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {result.isDeleted ? (
                        <span className="px-2 py-1 text-xs text-white rounded-full bg-red-500 line-through">
                          Semester {result.semester}
                        </span>
                      ) : (
                        <span className={`px-2 py-1 text-xs text-white rounded-full ${getSemesterColor(result.semester)}`}>
                          Semester {result.semester}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="group relative">
                        <span className={`text-sm ${isCurrentUser ? 'font-semibold text-green-600' : 'text-gray-900'} ${result.isDeleted ? 'line-through text-red-700' : ''} truncate block max-w-xs`}>
                          {result.uploadedBy}
                        </span>
                        {/* Tooltip */}
                        <div className="hidden group-hover:block absolute z-10 w-48 p-2 mt-1 text-sm bg-gray-900 text-white rounded-md shadow-lg">
                          <p className="font-medium">{result.uploadedBy}</p>
                          <p className="text-gray-300">{result.userEmail}</p>
                          {result.isDeleted && (
                            <p className="text-red-400 mt-1 text-xs">
                              🗑️ Deleted on {format(new Date(result.deletedAt), 'MMM d, yyyy')} by {result.deletedBy}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={result.isDeleted ? 'line-through text-red-700' : ''}>
                        {format(new Date(result.timestamp), 'MMM d, yyyy – h:mm a')}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {result.isDeleted ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 line-through">
                            {result.count} Results
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${result.count > 50 ? 'bg-yellow-100 text-yellow-800' : 
                              result.count < 10 ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {result.count} Results
                          </span>
                        )}
                        {!result.isDeleted && (
                          <button
                            onClick={() => {
                            const baseUrl = 'http://localhost:5000';
                            const fullUrl = result.fileUrl 
                              ? (result.fileUrl.startsWith('http') ? result.fileUrl : `${baseUrl}${result.fileUrl}`)
                              : null;
                            if (fullUrl) {
                              window.open(fullUrl, '_blank');
                            } else {
                              // Fallback to modal if no fileUrl
                              setSelectedResult(result);
                              setIsModalOpen(true);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Result Sheet"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden divide-y divide-gray-200">
        {filteredResults.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">No results found</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                {results.length === 0 
                  ? "No result uploads have been made yet." 
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          </div>
        ) : (
          filteredResults.map((result, index) => {
            const isCurrentUser = result.uploadedBy === currentUser.name;
            return (
              <div
                key={result.id}
                className={`p-4 ${isCurrentUser ? 'bg-green-50' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0 mr-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="font-medium text-blue-700 text-sm leading-tight break-words flex-1 min-w-0">{result.subject}</div>
                  </div>
                  <span className={`px-2 py-1 text-xs text-white rounded-full flex-shrink-0 ${getSemesterColor(result.semester)}`}>
                    S{result.semester}
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="text-xs text-gray-600 break-words">
                    <span className="font-medium">{result.faculty}</span> • <span className="font-medium">{result.degree}</span> • Year {result.year}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${isCurrentUser ? 'text-green-600 font-medium' : 'text-gray-700'} truncate mr-2`}>
                      {result.uploadedBy}
                    </span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${result.count > 50 ? 'bg-yellow-100 text-yellow-800' : 
                          result.count < 10 ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}
                      >
                        {result.count}
                      </span>
                      <button
                        onClick={() => {
                          const baseUrl = 'http://localhost:5000';
                          const fullUrl = result.fileUrl 
                            ? (result.fileUrl.startsWith('http') ? result.fileUrl : `${baseUrl}${result.fileUrl}`)
                            : null;
                          if (fullUrl) {
                            window.open(fullUrl, '_blank');
                          } else {
                            // Fallback to modal if no fileUrl
                            setSelectedResult(result);
                            setIsModalOpen(true);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="View Result Sheet"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 border-t pt-2">
                  {format(new Date(result.timestamp), 'MMM d, yyyy – h:mm a')}
                </div>
              </div>
            );
          })
        )}
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
});

export default ResultTable;