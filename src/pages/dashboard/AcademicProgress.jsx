import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentCheckIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const AcademicProgress = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to get achievement icon based on type
  const getAchievementIcon = (type) => {
    switch (type) {
      case 'deans_list':
        return TrophyIcon;
      case 'academic_excellence':
        return StarIcon;
      case 'research_excellence':
        return DocumentCheckIcon;
      case 'leadership':
        return TrophyIcon;
      case 'sports':
        return TrophyIcon;
      default:
        return StarIcon;
    }
  };

  useEffect(() => {
    const fetchAcademicProgress = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
          setError('Authentication required');
          return;
        }

        const response = await fetch('http://localhost:5000/api/academic-progress', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch academic progress');
        }

        const result = await response.json();

        if (result.success) {
          setAcademicData(result.data);
          // Set selected year to current year if available, otherwise first available year
          const availableYears = result.data.semesters ? Object.keys(result.data.semesters) : [];
          const defaultYear = result.data.currentStatus?.year && availableYears.includes(result.data.currentStatus.year)
            ? result.data.currentStatus.year
            : availableYears[0] || '2025';
          setSelectedYear(defaultYear);
        } else {
          setError(result.message || 'Failed to load academic progress');
        }
      } catch (err) {
        console.error('Error fetching academic progress:', err);
        setError(err.message || 'Failed to load academic progress');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademicProgress();
  }, []);

  // Ensure selectedYear is valid when data loads
  useEffect(() => {
    if (academicData?.semesters) {
      const availableYears = Object.keys(academicData.semesters);
      if (!availableYears.includes(selectedYear) && availableYears.length > 0) {
        setSelectedYear(availableYears[0]);
      }
    }
  }, [academicData, selectedYear]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 animate-fadeIn">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Loading your academic data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="relative mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Academic Progress
          </h1>
          <p className="text-gray-600">Track your academic journey and achievements</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading academic progress
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state if no data
  if (!academicData) {
    return (
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="relative mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Academic Progress
          </h1>
          <p className="text-gray-600">Track your academic journey and achievements</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No academic data available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your academic progress will appear here once results are uploaded.
          </p>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = academicData.overallProgress.totalCredits > 0
    ? (academicData.overallProgress.completedCredits / academicData.overallProgress.totalCredits) * 100
    : 0;
  const courseProgressPercentage = academicData.overallProgress.totalCourses > 0
    ? (academicData.overallProgress.coursesCompleted / academicData.overallProgress.totalCourses) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6 animate-fadeIn">
        {/* Page Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AcademicCapIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-cyan-800 dark:from-slate-200 dark:via-blue-200 dark:to-cyan-200 bg-clip-text text-transparent">
                Academic Progress
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">Track your academic journey and achievements</p>
            </div>
          </div>
        </div>

        {/* Overall Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* GPA Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/50 dark:to-cyan-900/50 rounded-2xl">
              <ChartBarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Current GPA</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{academicData.overallProgress.currentGPA}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">/ 4.0</span>
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Target: {academicData.overallProgress.targetGPA}
          </div>
        </div>

        {/* Credits Progress Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 stagger-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50 rounded-2xl">
              <BookOpenIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Credit Hours</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{academicData.overallProgress.completedCredits}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">/ {academicData.overallProgress.totalCredits}</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Courses Progress Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl">
              <AcademicCapIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
              {courseProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Courses Completed</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{academicData.overallProgress.coursesCompleted}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">/ {academicData.overallProgress.totalCourses}</span>
          </div>
          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${courseProgressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Time Status Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 stagger-3">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/50 dark:to-amber-900/50 rounded-2xl">
              <ClockIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-slate-700 dark:text-slate-300 font-semibold mb-2">Current Status</h3>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">Year {academicData.currentStatus?.year || 'N/A'}</div>
          <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{academicData.currentStatus?.semester || 'N/A'} (In Progress)</div>
        </div>
      </div>

      {/* Semester Selection and Progress */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 dark:from-slate-200 dark:to-blue-200 bg-clip-text text-transparent">Semester Progress</h2>
          <div className="flex flex-wrap gap-2">
            {academicData.semesters && Object.keys(academicData.semesters).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {academicData.semesters && academicData.semesters[selectedYear] ? (
            academicData.semesters[selectedYear].map((semester, index) => (
            <div key={index} className="border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-6 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{semester.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{semester.credits} Credit Hours</p>
                </div>
                {semester.completed ? (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                    Completed
                  </span>
                ) : semester.inProgress ? (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold rounded-full">
                    In Progress
                  </span>
                ) : (
                  <span className="px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-full">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Course List */}
              <div className="space-y-3">
                {semester.courses && semester.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{course.code}</span>
                      <span className="text-slate-500 dark:text-slate-400 ml-2">{course.name}</span>
                    </div>
                    <div>
                      {course.inProgress ? (
                        <span className="text-blue-600 dark:text-blue-400 font-medium">In Progress</span>
                      ) : (
                        <span className={`font-semibold ${
                          course.grade?.startsWith('A') ? 'text-green-600 dark:text-green-400' :
                          course.grade?.startsWith('B') ? 'text-blue-600 dark:text-blue-400' :
                          'text-slate-600 dark:text-slate-400'
                        }`}>
                          {course.grade}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {semester.gpa && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Semester GPA</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{semester.gpa}</span>
                  </div>
                </div>
              )}
            </div>
          ))  
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No semester data available for the selected year.</p>
            </div>
          )}
        </div>
      </div>

      {/* Academic Achievements */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/50 p-6 transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 dark:from-slate-200 dark:to-blue-200 bg-clip-text text-transparent mb-6">Academic Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {academicData.achievements && academicData.achievements.length > 0 ? (
            academicData.achievements.map((achievement, index) => {
              const IconComponent = getAchievementIcon(achievement.type);
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 hover:border-yellow-300 dark:hover:border-yellow-600 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-3 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/50 dark:to-amber-900/50 rounded-2xl flex-shrink-0">
                    <IconComponent className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100">{achievement.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{achievement.semester}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <TrophyIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No academic achievements yet.</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Keep working hard to earn your achievements!</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default AcademicProgress;