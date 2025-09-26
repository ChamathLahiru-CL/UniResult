import React from 'react';

/**
 * LastUpdatedResults Component
 * Displays the most recently updated exam results
 * Shows subject name, semester, and grade
 */
const LastUpdatedResults = ({ results = [] }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-8 -mb-8 opacity-50"></div>
      
      <div className="relative z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Last Updated Results
        </h2>
        
        {/* Results List */}
        <div className="space-y-3">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="flex items-start p-3 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
            >
              {/* Result Details */}
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium">
                    <span className="text-blue-600">{result.subject}</span>
                    <span className="text-gray-700"> {result.level} level</span>
                    <span className="text-xs ml-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      Semester {result.semester}
                    </span>
                  </span>
                  <span className={`font-bold px-3 py-1 rounded-full text-white shadow-sm ${
                    result.grade === 'A+' || result.grade === 'A' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                    result.grade === 'B+' || result.grade === 'B' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    result.grade === 'C+' || result.grade === 'C' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-r from-red-500 to-red-600'
                  }`}>
                    {result.grade}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No recent results available</p>
              <p className="text-gray-400 text-sm">Check back later for updates</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LastUpdatedResults;