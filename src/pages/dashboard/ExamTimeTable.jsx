import React, { useState } from 'react';

/**
 * ExamTimeTable Component
 * Displays examination schedules for different levels
 */
const ExamTimeTable = () => {
  const [activeLevel, setActiveLevel] = useState('100');
  const [downloading, setDownloading] = useState(false);

  // Function to handle timetable download
  const handleDownload = async (level) => {
    try {
      setDownloading(true);
      const response = await fetch(`/timetables/${level}-level-timetable.png`);
      const blob = await response.blob();
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${level}-Level-Timetable.png`;
      
      // Append to document, click, and clean up
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download timetable. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Level tabs configuration
  const levels = [
    { id: '100', name: '100 Level' },
    { id: '200', name: '200 Level' },
    { id: '300', name: '300 Level' },
    { id: '400', name: '400 Level' }
  ];

  // Sample exam table data (replace with actual data)
  const examTables = {
    '100': '/timetables/100-level-timetable.png',
    '200': '/timetables/200-level-timetable.png',
    '300': '/timetables/300-level-timetable.png',
    '400': '/timetables/400-level-timetable.png'
  };

  return (
    <div className="animate-fadeIn p-4">
      {/* Page Header */}
      <div className="relative mb-6">
        <div className="absolute top-0 left-0 w-12 h-12 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-2 right-12 w-16 h-12 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <h1 className="relative text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
          Examination Time Table
        </h1>
        <p className="text-gray-500 text-sm">
          Academic year 2024/2025 - Semester II Examination Schedule
        </p>
      </div>

      {/* Level Selection Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeLevel === level.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {level.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Timetable Display Section */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <img
            src={examTables[activeLevel]}
            alt={`${activeLevel} Level Exam Timetable`}
            className="w-full h-auto"
          />
        </div>

        {/* Download Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => handleDownload(activeLevel)}
            disabled={downloading}
            className={`
              inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-150 ease-in-out
              ${downloading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md'
              }
              text-white shadow transform hover:-translate-y-0.5 active:translate-y-0
            `}
          >
            {downloading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Timetable
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTimeTable;