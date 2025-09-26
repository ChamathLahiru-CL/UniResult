import React from 'react';

/**
 * GPA Summary Component
 * Displays student's current semester GPA and overall GPA
 */
const GPASummary = ({ currentGPA, overallGPA, semester }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-50 rounded-full"></div>
      
      <div className="relative">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          GPA Summary
        </h2>
        
        {/* Current Semester GPA */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-white p-4 rounded-lg border border-blue-100">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{currentGPA}</span>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            <p className="text-sm font-medium text-gray-600">Current GPA: Semester {semester}</p>
          </div>
        </div>
        
        {/* Overall GPA */}
        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg border border-gray-100">
          <span className="text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{overallGPA}</span>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-2 w-2 rounded-full bg-gray-500 mr-2"></span>
            <p className="text-sm font-medium text-gray-600">Overall GPA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPASummary;