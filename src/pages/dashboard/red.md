import React, { useState } from 'react';
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
  const [expandedLevels, setExpandedLevels] = useState(new Set(['100'])); // 100 level expanded by default
  const [expandedSemesters, setExpandedSemesters] = useState(new Set(['semester-1']));
  const [isExporting, setIsExporting] = useState(null);

  // Mock data for student results
  const resultData = {
    '100': {
      title: '100 Level',
      semesters: {
        '1': {
          title: '1st Semester',
          subjects: [
            { code: 'CSC101', title: 'Introduction to Computing', score: 85, grade: 'A', gp: 4.0, status: 'completed' },
            { code: 'MTH101', title: 'Mathematics I', score: 78, grade: 'B+', gp: 3.3, status: 'completed' },
            { code: 'ENG101', title: 'English I', score: 82, grade: 'A-', gp: 3.7, status: 'completed' },
            { code: 'PHY101', title: 'Physics I', score: null, grade: null, gp: null, status: 'pending' },
            { code: 'CHE101', title: 'Chemistry I', score: 75, grade: 'B', gp: 3.0, status: 'completed' }
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
      const headers = ['Subject Code', 'Subject Title', 'Score', 'Grade', 'GP', 'Status'];
      const csvContent = [
        headers.join(','),
        ...semesterData.subjects.map(subject => [
          subject.code,
          `"${subject.title}"`,
          subject.score || 'N/A',
          subject.grade || 'N/A',
          subject.gp || 'N/A',
          subject.status === 'completed' ? 'Completed' : 'Pending'
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
        semesterData.subjects.map(subject => 
          `${subject.code} - ${subject.title}: ${subject.score ? `${subject.score} (${subject.grade})` : 'Pending'}`
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
        <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300 shadow-sm">
          <CheckCircleIcon className="w-4 h-4 mr-2" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300 shadow-sm">
        <ClockIcon className="w-4 h-4 mr-2" />
        Result Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -translate-y-32 translate-x-32 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-100 to-transparent rounded-full translate-y-24 -translate-x-24 opacity-60"></div>
          
          <div className="relative p-8">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <AcademicCapIcon className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Academic Results
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Review your performance by level, semester and subject</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results by Level */}
        <div className="space-y-6">
          {Object.entries(resultData).map(([level, levelData]) => (
            <div key={level} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {/* Level Header */}
              <button
                onClick={() => toggleLevel(level)}
                className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 ${
                    level === '100' ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' :
                    level === '200' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' :
                    level === '300' ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white' :
                    'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                  }`}>
                    <AcademicCapIcon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {levelData.title}
                  </h2>
                </div>
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {expandedLevels.has(level) ? (
                    <ChevronUpIcon className="h-6 w-6 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-gray-600" />
                  )}
                </div>
              </button>

            {/* Semesters */}
            {expandedLevels.has(level) && (
              <div className="px-8 pb-8 pt-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="space-y-4">
                  {Object.entries(levelData.semesters).map(([semesterNum, semesterData]) => {
                    const semesterId = `semester-${semesterNum}`;
                    const completion = getCompletionPercentage(semesterData.subjects);
                    
                    return (
                      <div key={semesterId} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        {/* Semester Header */}
                        <button
                          onClick={() => toggleSemester(semesterId)}
                          className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all duration-300 group"
                        >
                          <div className="flex items-center space-x-4">
                            <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                              {semesterData.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className={`w-3 h-3 rounded-full ${
                                completion >= 80 ? 'bg-emerald-400' :
                                completion >= 50 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}></div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                                completion >= 80 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                completion >= 50 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                                'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {completion}% Complete
                              </span>
                            </div>
                          </div>
                          <div className="transform transition-transform duration-300 group-hover:scale-110">
                            {expandedSemesters.has(semesterId) ? (
                              <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                            )}
                          </div>
                        </button>

                        {/* Semester Content */}
                        {expandedSemesters.has(semesterId) && (
                          <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                            {/* Results Table */}
                            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-6">
                              <table className="w-full">
                                <thead>
                                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Subject Code</th>
                                    <th className="text-left py-4 px-6 font-semibold text-sm uppercase tracking-wider">Subject Title</th>
                                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">Score</th>
                                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">Grade</th>
                                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">GP</th>
                                    <th className="text-center py-4 px-6 font-semibold text-sm uppercase tracking-wider">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {semesterData.subjects.map((subject, index) => (
                                    <tr key={subject.code} className={`transition-all duration-200 hover:bg-blue-50 hover:shadow-sm ${
                                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }`}>
                                      <td className="py-4 px-6">
                                        <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-sm">
                                          {subject.code}
                                        </span>
                                      </td>
                                      <td className="py-4 px-6 text-gray-700 font-medium">{subject.title}</td>
                                      <td className="py-4 px-6 text-center">
                                        {subject.score ? (
                                          <span className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-800 font-bold rounded-full text-sm">
                                            {subject.score}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 text-lg">-</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        {subject.grade ? (
                                          <span className={`inline-flex items-center justify-center w-12 h-8 font-bold rounded-lg text-sm ${
                                            subject.grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                                            subject.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                                            subject.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                            'bg-red-100 text-red-800 border border-red-300'
                                          }`}>
                                            {subject.grade}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 text-lg">-</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        {subject.gp ? (
                                          <span className="inline-flex items-center justify-center w-12 h-8 bg-indigo-100 text-indigo-800 font-bold rounded-lg text-sm border border-indigo-300">
                                            {subject.gp}
                                          </span>
                                        ) : (
                                          <span className="text-gray-400 text-lg">-</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-6 text-center">
                                        <StatusBadge status={subject.status} />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Export Buttons */}
                            {canDownload(semesterData.subjects) && (
                              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                                <button
                                  onClick={() => exportToExcel(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-excel`}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-300 disabled:to-emerald-400 text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                                >
                                  {isExporting === `${semesterData.title}-excel` ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-5 w-5 mr-3" />
                                  )}
                                  Download Excel
                                </button>
                                
                                <button
                                  onClick={() => exportToPDF(semesterData, semesterData.title)}
                                  disabled={isExporting === `${semesterData.title}-pdf`}
                                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-300 disabled:to-red-400 text-white rounded-xl transition-all duration-300 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                                >
                                  {isExporting === `${semesterData.title}-pdf` ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                  ) : (
                                    <DocumentArrowDownIcon className="h-5 w-5 mr-3" />
                                  )}
                                  Download PDF
                                </button>
                              </div>
                            )}

                            {!canDownload(semesterData.subjects) && (
                              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 text-sm bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                                <div className="p-2 bg-yellow-100 rounded-full">
                                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                                </div>
                                <span className="text-yellow-800 font-medium">Download will be available when at least 50% of results are published</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  );
};

export default Results;