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
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="relative mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Academic Progress
          </h1>
          <p className="text-gray-600">Loading your academic data...</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Academic Progress
        </h1>
        <p className="text-gray-600">Track your academic journey and achievements</p>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* GPA Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Current GPA</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{academicData.overallProgress.currentGPA}</span>
            <span className="text-sm text-gray-500 ml-2">/ 4.0</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Target: {academicData.overallProgress.targetGPA}
          </div>
        </div>

        {/* Credits Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpenIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Credit Hours</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{academicData.overallProgress.completedCredits}</span>
            <span className="text-sm text-gray-500 ml-2">/ {academicData.overallProgress.totalCredits}</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Courses Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              {courseProgressPercentage.toFixed(1)}%
            </span>
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Courses Completed</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">{academicData.overallProgress.coursesCompleted}</span>
            <span className="text-sm text-gray-500 ml-2">/ {academicData.overallProgress.totalCourses}</span>
          </div>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${courseProgressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Time Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <ClockIcon className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
              Current
            </span>
          </div>
          <h3 className="text-gray-700 font-medium mb-2">Current Status</h3>
          <div className="text-3xl font-bold text-gray-900">Year {academicData.currentStatus?.year || 'N/A'}</div>
          <div className="mt-2 text-sm text-gray-500">{academicData.currentStatus?.semester || 'N/A'} (In Progress)</div>
        </div>
      </div>

      {/* Semester Selection and Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Semester Progress</h2>
          <div className="flex space-x-2">
            {academicData.semesters && Object.keys(academicData.semesters).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  selectedYear === year
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {academicData.semesters && academicData.semesters[selectedYear] ? (
            academicData.semesters[selectedYear].map((semester, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-6 hover:border-blue-200 transition-colors duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{semester.name}</h3>
                  <p className="text-sm text-gray-500">{semester.credits} Credit Hours</p>
                </div>
                {semester.completed ? (
                  <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                    Completed
                  </span>
                ) : semester.inProgress ? (
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                    In Progress
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-50 text-gray-600 text-sm font-medium rounded-full">
                    Upcoming
                  </span>
                )}
              </div>

              {/* Course List */}
              <div className="space-y-3">
                {semester.courses && semester.courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{course.code}</span>
                      <span className="text-gray-500 ml-2">{course.name}</span>
                    </div>
                    <div>
                      {course.inProgress ? (
                        <span className="text-blue-600">In Progress</span>
                      ) : (
                        <span className={`font-medium ${
                          course.grade?.startsWith('A') ? 'text-green-600' :
                          course.grade?.startsWith('B') ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {course.grade}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {semester.gpa && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Semester GPA</span>
                    <span className="text-lg font-bold text-gray-900">{semester.gpa}</span>
                  </div>
                </div>
              )}
            </div>
          ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No semester data available for the selected year.</p>
            </div>
          )}
        </div>
      </div>

      {/* Academic Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Academic Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {academicData.achievements && academicData.achievements.length > 0 ? (
            academicData.achievements.map((achievement, index) => {
              const IconComponent = getAchievementIcon(achievement.type);
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-200"
                >
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <IconComponent className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-500">{achievement.semester}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No academic achievements yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicProgress;