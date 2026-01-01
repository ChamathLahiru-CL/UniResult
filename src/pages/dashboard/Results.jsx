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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">Academic Results</h1>
                  <p className="text-blue-100 text-sm sm:text-base mt-1">Review your academic performance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your results...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 sm:p-12 text-center">
            <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Results</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Results Content */}
      {!loading && !error && (
        <div className="space-y-6">
          {Object.entries(resultData).map(([level, levelData]) => (
            <div key={level} 
              className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-300 hover:scale-[1.01]">
              {/* Level Header */}
              <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <AcademicCapIcon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {levelData.title}
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLevel(level);
                      }}
                      className="px-5 py-2.5 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl hover:bg-white/30 hover:shadow-lg transition-all duration-200 font-medium active:scale-95 text-center"
                    >
                      {expandedLevels.has(level) ? (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Collapse</span>
                          <ChevronUpIcon className="h-5 w-5" />
                        </span>
                      ) : (
                        <span className="flex items-center justify-center space-x-2">
                          <span>Expand</span>
                          <ChevronDownIcon className="h-5 w-5" />
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Semesters */}
              {expandedLevels.has(level) && (
                <div className="p-4 sm:p-6 space-y-4 bg-gray-50">
                  {Object.entries(levelData.semesters).map(([semesterNum, semesterData]) => {
                    const semesterId = `semester-${semesterNum}`;
                    const completion = getCompletionPercentage(semesterData.subjects);
                    
                    return (
                      <div key={semesterId} 
                        className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
                        {/* Semester Header */}
                        <button
                          onClick={() => toggleSemester(semesterId)}
                          className="w-full px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-150 hover:to-indigo-150 transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 text-left">{semesterData.title}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                                completion >= 80 ? 'bg-green-100 text-green-700 border border-green-300' :
                                completion >= 50 ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                'bg-red-100 text-red-700 border border-red-300'
                              }`}>
                                {completion}% Complete
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-end">
                            {expandedSemesters.has(semesterId) ? (
                              <ChevronUpIcon className="h-5 w-5 text-blue-600" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </button>

                        {/* Semester Content */}
                        {expandedSemesters.has(semesterId) && (
                          <div className="p-4 sm:p-6 bg-white">
                            {/* Results Table */}
                            <div className="space-y-3 mb-6">
                              {/* Table Header */}
                              <div className="hidden lg:grid lg:grid-cols-6 gap-4 px-4 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
                                <div className="font-semibold text-blue-700 text-sm">Subject Code</div>
                                <div className="col-span-2 font-semibold text-blue-700 text-sm">Subject Title</div>
                                <div className="text-center font-semibold text-blue-700 text-sm">Credits</div>
                                <div className="text-center font-semibold text-blue-700 text-sm">Grade</div>
                                <div className="text-center font-semibold text-blue-700 text-sm">Status</div>
                              </div>
                              
                              {/* Table Rows - Card Style */}
                              {semesterData.subjects.map((subject, index) => (
                                <div key={subject.code || index} 
                                  className={`grid grid-cols-1 lg:grid-cols-6 gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-md ${
                                    highlightedSubject === subject.code 
                                      ? 'bg-yellow-50 border-yellow-300 shadow-lg' 
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}>
                                  {/* Mobile Labels */}
                                  <div className="lg:col-span-1 flex items-center gap-2">
                                    <span className="text-xs text-blue-600 font-medium lg:hidden">Code:</span>
                                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{subject.code || 'N/A'}</span>
                                  </div>
                                  <div className="lg:col-span-2 flex items-center gap-2">
                                    <span className="text-xs text-blue-600 font-medium lg:hidden">Subject:</span>
                                    <span className="text-gray-700 text-sm sm:text-base">{subject.title}</span>
                                  </div>
                                  <div className="lg:text-center flex items-center gap-2 lg:block">
                                    <span className="text-xs text-blue-600 font-medium lg:hidden">Credits:</span>
                                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                                      {subject.creditCount || 3}
                                    </span>
                                  </div>
                                  <div className="lg:text-center flex items-center gap-2 lg:block">
                                    <span className="text-xs text-blue-600 font-medium lg:hidden">Grade:</span>
                                    {subject.grade ? (
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                        subject.grade.startsWith('A') ? 'bg-green-100 text-green-700 border border-green-300' :
                                        subject.grade.startsWith('B') ? 'bg-purple-100 text-purple-700 border border-purple-300' :
                                        subject.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' :
                                        'bg-red-100 text-red-700 border border-red-300'
                                      }`}>
                                        {subject.grade}
                                      </span>
                                    ) : (
                                      <span className="text-gray-400 text-sm">-</span>
                                    )}
                                  </div>
                                  <div className="lg:text-center flex items-center gap-2 lg:block">
                                    <span className="text-xs text-blue-600 font-medium lg:hidden">Status:</span>
                                    <StatusBadge status={subject.status} />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Export Buttons */}
                            {canDownload(semesterData.subjects) && (
                              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t-2 border-gray-200">
                                <button
                                  onClick={() => exportToExcel(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-excel`}
                                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl active:scale-95"
                                >
                                  {isExporting === `${semesterData.title}-excel` ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                  )}
                                  Download Excel
                                </button>
                                
                                <button
                                  onClick={() => exportToPDF(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-pdf`}
                                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg active:scale-95"
                                >
                                  {isExporting === `${semesterData.title}-pdf` ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-2"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                  )}
                                  Download PDF
                                </button>
                              </div>
                            )}

                            {!canDownload(semesterData.subjects) && (
                              <div className="flex items-center space-x-2 pt-6 border-t-2 border-gray-200 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                                <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-medium">Download will be available when at least 50% of results are published</span>
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
    </div>
  );
};

export default Results;