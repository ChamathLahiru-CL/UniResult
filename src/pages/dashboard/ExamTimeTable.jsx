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
      <div className="mb-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2">
          <nav className="flex gap-2" aria-label="Tabs">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => setActiveLevel(level.id)}
                className={`
                  relative px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-200
                  focus:outline-none transform
                  ${activeLevel === level.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 hover:bg-white hover:shadow-sm active:scale-95'
                  }
                `}
              >
                {level.name}
                {activeLevel === level.id && (
                  <span className="absolute inset-0 rounded-xl bg-white/20 animate-pulse-slow"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Timetable Display Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 transition-all duration-300">
        <div className="overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-white">
          <div className="flex justify-center items-center p-4">
            <img
              src={examTables[activeLevel]}
              alt={`${activeLevel} Level Exam Timetable`}
              className="w-auto max-h-[1024px] object-contain rounded-lg shadow-sm transition-transform duration-300 hover:scale-[1.02]"
              style={{ maxWidth: '90%' }}
            />
          </div>
        </div>

        {/* Download Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => handleDownload(activeLevel)}
            disabled={downloading}
            className={`
              group relative inline-flex items-center px-6 py-3 text-sm font-medium rounded-xl
              transition-all duration-200 ease-in-out focus:outline-none
              ${downloading 
                ? 'bg-blue-400/90 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 active:scale-[0.98]'
              }
              text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30
            `}
          >
            <span className="relative flex items-center">
              {downloading ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white/90" 
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
                  <span className="text-white/90">Downloading...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-y-0.5"
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
                  <span>Download Timetable</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTimeTable;