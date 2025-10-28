import React, { useState } from 'react';
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
 * Features: Collapsible sections, export functionality, status indicators
 */
const Results = () => {
  const [expandedLevels, setExpandedLevels] = useState(new Set([])); // All sections collapsed by default
  const [expandedSemesters, setExpandedSemesters] = useState(new Set([]));
  const [isExporting, setIsExporting] = useState(null);

  // Mock data for student results
  const resultData = {
    '100': {
      title: '100 Level',
      semesters: {
        '1': {
          title: '1st Semester',
          subjects: [
            { code: 'CSC101', title: 'Introduction to Computing', creditCount: 3, grade: 'A', status: 'completed', updateDate: '2025-10-15' },
            { code: 'MTH101', title: 'Mathematics I', creditCount: 4, grade: 'B+', status: 'completed', updateDate: '2025-10-18' },
            { code: 'ENG101', title: 'English I', creditCount: 2, grade: 'A-', status: 'completed', updateDate: '2025-10-20' },
            { code: 'PHY101', title: 'Physics I', creditCount: 3, grade: null, status: 'pending', updateDate: null },
            { code: 'CHE101', title: 'Chemistry I', creditCount: 3, grade: 'B', status: 'completed', updateDate: '2025-10-25' }
          ]
        },
        '2': {
          title: '2nd Semester',
          subjects: [
            { code: 'CSC102', title: 'Programming Fundamentals', score: 88, grade: 'A', gp: 4.0, status: 'completed' },
            { code: 'MTH102', title: 'Mathematics II', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'ENG102', title: 'English II', score: 80, grade: 'A-', gp: 3.7, status: 'completed' },
            { code: 'PHY102', title: 'Physics II', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'STA101', title: 'Statistics', score: 76, grade: 'B+', gp: 3.3, status: 'completed' }
          ]
        }
      }
    },
    '200': {
      title: '200 Level',
      semesters: {
        '3': {
          title: '3rd Semester',
          subjects: [
            { code: 'CSC201', title: 'Data Structures', score: 90, grade: 'A+', gp: 4.0, status: 'completed' },
            { code: 'CSC202', title: 'Computer Architecture', score: 83, grade: 'A-', gp: 3.7, status: 'completed' },
            { code: 'MTH201', title: 'Discrete Mathematics', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC203', title: 'Database Systems', score: 87, grade: 'A', gp: 4.0, status: 'completed' },
            { code: 'CSC204', title: 'Software Engineering', score: null, grade: null, gp: null, status: 'pending' }
          ]
        },
        '4': {
          title: '4th Semester',
          subjects: [
            { code: 'CSC205', title: 'Algorithms', score: 85, grade: 'A', gp: 4.0, status: 'completed' },
            { code: 'CSC206', title: 'Operating Systems', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC207', title: 'Computer Networks', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'MTH202', title: 'Linear Algebra', score: 79, grade: 'B+', gp: 3.3, status: 'completed' },
            { code: 'CSC208', title: 'Web Development', score: 92, grade: 'A+', gp: 4.0, status: 'completed' }
          ]
        }
      }
    },
    '300': {
      title: '300 Level',
      semesters: {
        '5': {
          title: '5th Semester',
          subjects: [
            { code: 'CSC301', title: 'Advanced Programming', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC302', title: 'Machine Learning', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC303', title: 'Software Project', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC304', title: 'Information Security', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC305', title: 'Mobile App Development', score: null, grade: null, gp: null, status: 'pending' }
          ]
        },
        '6': {
          title: '6th Semester',
          subjects: [
            { code: 'CSC306', title: 'Cloud Computing', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC307', title: 'Data Mining', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC308', title: 'Computer Graphics', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC309', title: 'AI Fundamentals', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC310', title: 'DevOps Practices', score: null, grade: null, gp: null, status: 'pending' }
          ]
        }
      }
    },
    '400': {
      title: '400 Level',
      semesters: {
        '7': {
          title: '7th Semester',
          subjects: [
            { code: 'CSC401', title: 'Final Year Project I', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC402', title: 'Advanced Database', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC403', title: 'Distributed Systems', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC404', title: 'Research Methodology', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC405', title: 'Professional Ethics', score: null, grade: null, gp: null, status: 'pending' }
          ]
        },
        '8': {
          title: '8th Semester',
          subjects: [
            { code: 'CSC406', title: 'Final Year Project II', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC407', title: 'Industry Internship', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC408', title: 'Advanced Topics in CS', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CSC409', title: 'Seminar Presentation', score: null, grade: null, gp: null, status: 'pending' }
          ]
        }
      }
    }
  };

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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-600 border border-green-200 transition-all duration-300 hover:bg-green-100 hover:shadow-sm transform hover:scale-105">
          <CheckCircleIcon className="w-4 h-4 mr-1.5" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-50 text-yellow-600 border border-yellow-200 transition-all duration-300 hover:bg-yellow-100 hover:shadow-sm transform hover:scale-105">
        <ClockIcon className="w-4 h-4 mr-1.5" />
        Pending
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-8 border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="flex items-center space-x-4">
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl shadow-inner transform hover:scale-105 transition-transform duration-300">
            <AcademicCapIcon className="h-10 w-10 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Academic Results
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Review your academic journey and achievements</p>
          </div>
        </div>
      </div>

      {/* Initial Guide Message */}
      <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl p-4 border border-blue-100 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ChevronDownIcon className="h-5 w-5 text-blue-600 animate-bounce" />
          </div>
          <p className="text-gray-600">
            Click on any level section below to view detailed results and semester information
          </p>
        </div>
      </div>

      {/* Results by Level */}
      <div className="space-y-6">
        {Object.entries(resultData).map(([level, levelData], index) => (
          <div key={level} 
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:border-blue-200"
            style={{ 
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              opacity: 0,
            }}>
            {/* Level Header */}
            <button
              onClick={() => toggleLevel(level)}
              className="w-full px-8 py-5 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-md transform group-hover:scale-110 ${
                  level === '100' ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-600' :
                  level === '200' ? 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600' :
                  level === '300' ? 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600' :
                  'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600'
                }`}>
                  <AcademicCapIcon className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                    {levelData.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500 group-hover:text-blue-500 transition-all duration-300">
                      {expandedLevels.has(level) ? 'Click to collapse' : 'Click to view results'}
                    </p>
                    {!expandedLevels.has(level) && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200">
                        Click to expand
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {expandedLevels.has(level) ? (
                <ChevronUpIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:-translate-y-1" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-y-1" />
              )}
            </button>

            {/* Semesters */}
            {expandedLevels.has(level) && (
              <div className="px-6 pb-6 space-y-4">
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
                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 group"
                      >
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{semesterData.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            completion >= 80 ? 'bg-green-100 text-green-800' :
                            completion >= 50 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {completion}% Complete
                          </span>
                        </div>
                        {expandedSemesters.has(semesterId) ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </button>

                      {/* Semester Content */}
                      {expandedSemesters.has(semesterId) && (
                        <div className="p-4">
                          {/* Results Table */}
                          <div className="overflow-x-auto mb-4">
                            <table className="w-full table-auto">
                              <thead>
                                <tr className="border-b-2 border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50">
                                  <th className="text-left py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Subject Code
                                    </span>
                                  </th>
                                  <th className="text-left py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Subject Title
                                    </span>
                                  </th>
                                  <th className="text-center py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Credit Count
                                    </span>
                                  </th>
                                  <th className="text-center py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Grade
                                    </span>
                                  </th>
                                  <th className="text-center py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Status
                                    </span>
                                  </th>
                                  <th className="text-center py-4 px-4">
                                    <span className="inline-block font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300">
                                      Update Date
                                    </span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {semesterData.subjects.map((subject, index) => (
                                  <tr key={subject.code} className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-[1.01] ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                  }`}>
                                    <td className="py-4 px-4 font-medium text-gray-900">{subject.code}</td>
                                    <td className="py-4 px-4 text-gray-700">{subject.title}</td>
                                    <td className="py-4 px-4 text-center">
                                      <span className="font-semibold text-gray-900 bg-blue-50 px-3 py-1 rounded-full">
                                        {subject.creditCount || 3}
                                      </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      {subject.grade ? (
                                        <span className={`font-semibold px-3 py-1 rounded-full ${
                                          subject.grade.startsWith('A') ? 'bg-green-50 text-green-600' :
                                          subject.grade.startsWith('B') ? 'bg-blue-50 text-blue-600' :
                                          subject.grade.startsWith('C') ? 'bg-yellow-50 text-yellow-600' :
                                          'bg-red-50 text-red-600'
                                        }`}>
                                          {subject.grade}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <StatusBadge status={subject.status} />
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                      <span className="text-sm text-gray-500">
                                        {subject.updateDate || (subject.status === 'completed' ? '2025-10-28' : '-')}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Export Buttons */}
                          {canDownload(semesterData.subjects) && (
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => exportToExcel(semesterData, semesterData.title)}
                                disabled={isExporting === `${semesterData.title}-excel`}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-all duration-300 text-sm font-medium hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                              >
                                {isExporting === `${semesterData.title}-excel` ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                ) : (
                                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                )}
                                Download Excel
                              </button>
                              
                              <button
                                onClick={() => exportToPDF(semesterData, semesterData.title)}
                                disabled={isExporting === `${semesterData.title}-pdf`}
                                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-all duration-300 text-sm font-medium hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 active:scale-95"
                              >
                                {isExporting === `${semesterData.title}-pdf` ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                ) : (
                                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                                )}
                                Download PDF
                              </button>
                            </div>
                          )}

                          {!canDownload(semesterData.subjects) && (
                            <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 text-sm text-gray-500">
                              <ExclamationTriangleIcon className="h-4 w-4" />
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
    </div>
  );
};

export default Results;