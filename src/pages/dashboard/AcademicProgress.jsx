import React, { useState } from 'react';
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

  // Mock data - Replace with actual data from your backend
  const academicData = {
    overallProgress: {
      totalCredits: 120,
      completedCredits: 75,
      currentGPA: 3.72,
      targetGPA: 3.8,
      coursesCompleted: 25,
      totalCourses: 40,
    },
    semesters: {
      '2023': [
        {
          name: '1st Semester',
          gpa: 3.65,
          credits: 15,
          completed: true,
          courses: [
            { code: 'IT1010', name: 'Introduction to Programming', grade: 'A', credits: 3 },
            { code: 'IT1020', name: 'Web Development Basics', grade: 'A-', credits: 3 },
            { code: 'IT1030', name: 'Computer Networks', grade: 'B+', credits: 3 },
            { code: 'IT1040', name: 'Database Systems', grade: 'A', credits: 3 },
            { code: 'IT1050', name: 'Mathematics for IT', grade: 'B+', credits: 3 },
          ]
        },
        {
          name: '2nd Semester',
          gpa: 3.70,
          credits: 15,
          completed: true,
          courses: [
            { code: 'IT2010', name: 'Advanced Programming', grade: 'A', credits: 3 },
            { code: 'IT2020', name: 'Software Engineering', grade: 'A-', credits: 3 },
            { code: 'IT2030', name: 'Operating Systems', grade: 'B+', credits: 3 },
            { code: 'IT2040', name: 'Data Structures', grade: 'A', credits: 3 },
            { code: 'IT2050', name: 'Web Applications', grade: 'A-', credits: 3 },
          ]
        }
      ],
      '2024': [
        {
          name: '3rd Semester',
          gpa: 3.80,
          credits: 15,
          completed: true,
          courses: [
            { code: 'IT3010', name: 'Mobile Development', grade: 'A', credits: 3 },
            { code: 'IT3020', name: 'Cloud Computing', grade: 'A', credits: 3 },
            { code: 'IT3030', name: 'Cybersecurity', grade: 'A-', credits: 3 },
            { code: 'IT3040', name: 'AI Fundamentals', grade: 'B+', credits: 3 },
            { code: 'IT3050', name: 'Project Management', grade: 'A', credits: 3 },
          ]
        },
        {
          name: '4th Semester',
          gpa: 3.75,
          credits: 15,
          completed: true,
          courses: [
            { code: 'IT4010', name: 'Advanced Web Dev', grade: 'A-', credits: 3 },
            { code: 'IT4020', name: 'DevOps Practices', grade: 'A', credits: 3 },
            { code: 'IT4030', name: 'Data Analytics', grade: 'B+', credits: 3 },
            { code: 'IT4040', name: 'IoT Systems', grade: 'A', credits: 3 },
            { code: 'IT4050', name: 'Research Methods', grade: 'A-', credits: 3 },
          ]
        }
      ],
      '2025': [
        {
          name: '5th Semester',
          gpa: 3.70,
          credits: 15,
          completed: true,
          courses: [
            { code: 'IT5010', name: 'Enterprise Software', grade: 'A-', credits: 3 },
            { code: 'IT5020', name: 'System Architecture', grade: 'B+', credits: 3 },
            { code: 'IT5030', name: 'Machine Learning', grade: 'A', credits: 3 },
            { code: 'IT5040', name: 'Blockchain Tech', grade: 'A-', credits: 3 },
            { code: 'IT5050', name: 'IT Ethics', grade: 'A', credits: 3 },
          ]
        },
        {
          name: '6th Semester',
          credits: 15,
          inProgress: true,
          courses: [
            { code: 'IT6010', name: 'Final Project', inProgress: true, credits: 6 },
            { code: 'IT6020', name: 'IT Strategy', inProgress: true, credits: 3 },
            { code: 'IT6030', name: 'Enterprise Security', inProgress: true, credits: 3 },
            { code: 'IT6040', name: 'Digital Innovation', inProgress: true, credits: 3 },
          ]
        }
      ]
    },
    achievements: [
      { title: "Dean's List", semester: "2024 - Semester 1", icon: TrophyIcon },
      { title: 'Academic Excellence Award', semester: "2024 - Semester 2", icon: StarIcon },
      { title: 'Research Excellence', semester: "2025 - Semester 1", icon: DocumentCheckIcon },
    ]
  };

  // Calculate progress percentage
  const progressPercentage = (academicData.overallProgress.completedCredits / academicData.overallProgress.totalCredits) * 100;
  const courseProgressPercentage = (academicData.overallProgress.coursesCompleted / academicData.overallProgress.totalCourses) * 100;

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
          <div className="text-3xl font-bold text-gray-900">Year 3</div>
          <div className="mt-2 text-sm text-gray-500">Semester 6 (In Progress)</div>
        </div>
      </div>

      {/* Semester Selection and Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Semester Progress</h2>
          <div className="flex space-x-2">
            {Object.keys(academicData.semesters).map((year) => (
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
          {academicData.semesters[selectedYear].map((semester, index) => (
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
                {semester.courses.map((course, courseIndex) => (
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
          ))}
        </div>
      </div>

      {/* Academic Achievements */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Academic Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {academicData.achievements.map((achievement, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-yellow-200 hover:bg-yellow-50 transition-all duration-200"
            >
              <div className="p-2 bg-yellow-100 rounded-lg">
                <achievement.icon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                <p className="text-sm text-gray-500">{achievement.semester}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademicProgress;