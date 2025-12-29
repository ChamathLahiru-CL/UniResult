import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Results.css'; // Create this file for animations
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  DocumentArrowDownIcon,
  AcademicCapIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

/**
 * Student Results Component
 * Displays academic results organized by level and semester
 * Features: Collapsible sections, export functionality, status indicators, navigation state handling
 */
const Results = () => {
  const location = useLocation();
  const [expandedLevels, setExpandedLevels] = useState(new Set([])); // All sections collapsed by default
  const [expandedSemesters, setExpandedSemesters] = useState(new Set([]));
  const [isExporting, setIsExporting] = useState(null);
  const [highlightedSubject, setHighlightedSubject] = useState(null);
  const [resultData, setResultData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle navigation from dashboard
  useEffect(() => {
    if (location.state) {
      const { expandLevel, expandSemester, highlightSubject } = location.state;
      
      // Expand specific level and semester if provided
      if (expandLevel) {
        setExpandedLevels(new Set([expandLevel]));
      }
      if (expandSemester) {
        setExpandedSemesters(new Set([expandSemester]));
      }
      if (highlightSubject) {
        setHighlightedSubject(highlightSubject);
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedSubject(null), 3000);
      }

      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fetch results from API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('🔍 Fetching student results...');
        console.log('Token exists:', !!token);
        
        if (!token) {
          console.error('❌ No token found in localStorage!');
          setError('Not authenticated. Please login again.');
          setLoading(false);
          return;
        }
        
        console.log('Token preview:', token.substring(0, 20) + '...');
        
        const response = await fetch('http://localhost:5000/api/results/my-results-organized', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('Response status:', response.status);

        if (response.ok) {
          const result = await response.json();
          console.log('Response data:', result);
          
          if (result.success) {
            setResultData(result.data);
            console.log('✅ Results loaded successfully');
          } else {
            console.error('❌ API returned error:', result.message);
            setError(result.message || 'Failed to fetch results');
          }
        } else {
          const errorData = await response.json();
          console.error('❌ HTTP error:', response.status, errorData);
          setError(errorData.message || 'Failed to fetch results');
        }
      } catch (err) {
        console.error('❌ Error fetching results:', err);
        setError('Network error while fetching results');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  // Toggle level expansion
  const toggleLevel = (level) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(level)) {
      newExpanded.delete(level);
      // Also collapse all semesters in this level
      const levelSemesters = Object.keys(resultData[level].semesters).map(s => `semester-${s}`);
      levelSemesters.forEach(sem => {
        const newSemesters = new Set(expandedSemesters);
        newSemesters.delete(sem);
        setExpandedSemesters(newSemesters);
      });
    } else {
      newExpanded.add(level);
    }
    setExpandedLevels(newExpanded);
  };

  // Toggle semester expansion
  const toggleSemester = (semesterId) => {
    const newExpanded = new Set(expandedSemesters);
    if (newExpanded.has(semesterId)) {
      newExpanded.delete(semesterId);
    } else {
      newExpanded.add(semesterId);
    }
    setExpandedSemesters(newExpanded);
  };

  // Calculate completion percentage for a semester
  const getCompletionPercentage = (subjects) => {
    const completed = subjects.filter(s => s.status === 'completed').length;
    return Math.round((completed / subjects.length) * 100);
  };

  // Check if download should be enabled (>50% completion)
  const canDownload = (subjects) => {
    return getCompletionPercentage(subjects) >= 50;
  };

  // Export functions
  const exportToExcel = async (semesterData, semesterTitle) => {
    setIsExporting(`${semesterTitle}-excel`);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content (simplified Excel alternative)
      const headers = ['Subject Code', 'Subject Title', 'Credit Count', 'Grade', 'Status', 'Update Date'];
      const csvContent = [
        headers.join(','),
        ...semesterData.subjects.map(subject => [
          subject.code,
          `"${subject.title}"`,
          subject.creditCount || '3',
          subject.grade || 'N/A',
          subject.status === 'completed' ? 'Completed' : 'Pending',
          subject.updateDate || (subject.status === 'completed' ? '2025-10-28' : 'N/A')
        ].join(','))
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${semesterTitle.replace(/\s+/g, '_')}_Results.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportToPDF = async (semesterData, semesterTitle) => {
    setIsExporting(`${semesterTitle}-pdf`);
    try {
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll create a simple text file
      // In production, you'd use jsPDF or similar library
      const content = `${semesterTitle} Results\n\n` +
        'Subject Code | Subject Title | Credit Count | Grade | Status | Update Date\n' +
        '------------|---------------|--------------|--------|--------|-------------\n' +
        semesterData.subjects.map(subject => 
          `${subject.code} | ${subject.title} | ${subject.creditCount || '3'} | ${subject.grade || 'N/A'} | ${
            subject.status === 'completed' ? 'Completed' : 'Pending'} | ${
            subject.updateDate || (subject.status === 'completed' ? '2025-10-28' : 'N/A')}`
        ).join('\n');

      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${semesterTitle.replace(/\s+/g, '_')}_Results.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsExporting(null);
    }
  };

  // Get status badge component
  const StatusBadge = ({ status }) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-green-50 text-green-600 border border-green-200 transition-all duration-300 hover:bg-green-100 hover:shadow-sm transform hover:scale-105">
          <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          <span className="hidden sm:inline">Completed</span>
          <span className="sm:hidden">Done</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-50 text-yellow-600 border border-yellow-200 transition-all duration-300 hover:bg-yellow-100 hover:shadow-sm transform hover:scale-105">
        <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
        <span className="hidden sm:inline">Pending</span>
        <span className="sm:hidden">Wait</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg sm:rounded-xl shadow-inner">
              <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Academic Results</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Review your academic performance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your results...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Results</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Results Content */}
      {!loading && !error && (
        <div className="space-y-4">
          {Object.entries(resultData).map(([level, levelData], index) => (
            <div key={level} 
              className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/50 hover:border-blue-200 transform hover:scale-[1.02] hover:-translate-y-1 group cursor-pointer"
              style={{ 
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                opacity: 0,
              }}>
              {/* Level Header */}
              <div className="w-full px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-50/30 to-white transition-all duration-300 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:shadow-inner">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 w-full">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-full shadow-sm transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200/30 transform group-hover:scale-110 group-hover:-translate-y-1 ${
                      level === '100' ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600 group-hover:from-green-200 group-hover:to-green-300' :
                      level === '200' ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 group-hover:from-blue-200 group-hover:to-blue-300' :
                      level === '300' ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 group-hover:from-purple-200 group-hover:to-purple-300' :
                      'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 group-hover:from-orange-200 group-hover:to-orange-300'
                    }`}>
                      <AcademicCapIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-bold text-blue-600 transition-all duration-300 group-hover:text-blue-700 group-hover:scale-105 transform">
                      {levelData.title}
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button 
                      className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 hover:shadow-md hover:scale-105 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLevel(level);
                      }}
                    >
                      Click to view results
                    </button>
                    <button
                      className="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-full hover:bg-blue-50 hover:border-blue-300 hover:shadow-md hover:scale-105 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLevel(level);
                      }}
                    >
                      {expandedLevels.has(level) ? 'Collapse' : 'Click to expand'}
                    </button>
                    <div className="flex justify-center sm:justify-start">
                      {expandedLevels.has(level) ? (
                        <ChevronUpIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 transition-all duration-300 transform group-hover:-translate-y-1 group-hover:scale-110" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 transition-all duration-300 transform group-hover:translate-y-1 group-hover:scale-110 animate-bounce" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Semesters */}
              {expandedLevels.has(level) && (
                <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                  {Object.entries(levelData.semesters).map(([semesterNum, semesterData]) => {
                    const semesterId = `semester-${semesterNum}`;
                    const completion = getCompletionPercentage(semesterData.subjects);
                    
                    return (
                      <div key={semesterId} 
                        className="border border-gray-200 rounded-lg overflow-hidden transform transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-blue-300 bg-white"
                        style={{ animation: `fadeInUp 0.5s ease-out ${semesterNum * 0.1}s both` }}>
                        {/* Semester Header */}
                        <button
                          onClick={() => toggleSemester(semesterId)}
                          className="w-full px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 w-full">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 text-left">{semesterData.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                              completion >= 80 ? 'bg-green-100 text-green-800' :
                              completion >= 50 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {completion}% Complete
                            </span>
                          </div>
                          <div className="flex justify-center sm:justify-end">
                            {expandedSemesters.has(semesterId) ? (
                              <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {/* Semester Content */}
                        {expandedSemesters.has(semesterId) && (
                          <div className="p-3 sm:p-4">
                            {/* Results Table */}
                            <div className="overflow-x-auto mb-4 -mx-3 sm:mx-0">
                              <div className="min-w-full inline-block align-middle">
                                <table className="w-full table-auto min-w-[600px]">
                                  <thead>
                                    <tr className="border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
                                      <th className="text-left py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Subject Code
                                        </span>
                                      </th>
                                      <th className="text-left py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Subject Title
                                        </span>
                                      </th>
                                      <th className="text-center py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Credit Count
                                        </span>
                                      </th>
                                      <th className="text-center py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Grade
                                        </span>
                                      </th>
                                      <th className="text-center py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Status
                                        </span>
                                      </th>
                                      <th className="text-center py-3 sm:py-4 px-2 sm:px-4">
                                        <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 text-xs sm:text-sm">
                                          Update Date
                                        </span>
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {semesterData.subjects.map((subject, index) => (
                                      <tr key={subject.code || index} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.01] ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                      } ${
                                        highlightedSubject === subject.code ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-300 shadow-lg ring-2 ring-yellow-300/50 animate-pulse' : ''
                                      }`}>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-gray-900 text-xs sm:text-sm">{subject.code || 'N/A'}</td>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-700 text-xs sm:text-sm">{subject.title}</td>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                          <span className="font-semibold text-gray-900 bg-blue-50 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                                            {subject.creditCount || 3}
                                          </span>
                                        </td>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                          {subject.grade ? (
                                            <span className={`font-semibold px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                                              subject.grade.startsWith('A') ? 'bg-green-50 text-green-600' :
                                              subject.grade.startsWith('B') ? 'bg-blue-50 text-blue-600' :
                                              subject.grade.startsWith('C') ? 'bg-yellow-50 text-yellow-600' :
                                              'bg-red-50 text-red-600'
                                            }`}>
                                              {subject.grade}
                                            </span>
                                          ) : (
                                            <span className="text-gray-400 text-xs sm:text-sm">-</span>
                                          )}
                                        </td>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                          <StatusBadge status={subject.status} />
                                        </td>
                                        <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                          <span className="text-xs sm:text-sm text-gray-500">
                                            {subject.updateDate || (subject.status === 'completed' ? '2025-10-28' : '-')}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {/* Export Buttons */}
                            {canDownload(semesterData.subjects) && (
                              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => exportToExcel(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-excel`}
                                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                >
                                  {isExporting === `${semesterData.title}-excel` ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  )}
                                  Download Excel
                                </button>
                                
                                <button
                                  onClick={() => exportToPDF(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-pdf`}
                                  className="inline-flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                                >
                                  {isExporting === `${semesterData.title}-pdf` ? (
                                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  )}
                                  Download PDF
                                </button>
                              </div>
                            )}

                            {!canDownload(semesterData.subjects) && (
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 pt-4 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
                                <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                                <span>Download will be available when at least 50% of results are published</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Results;