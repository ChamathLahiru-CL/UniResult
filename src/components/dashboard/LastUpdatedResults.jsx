import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon, 
  ArrowTopRightOnSquareIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

/**
 * LastUpdatedResults Component
 * Displays the most recently updated exam results with navigation
 * Shows subject name, semester, grade, and links to detailed results
 * Fetches latest 5 results from backend
 */
const LastUpdatedResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch latest results from backend
  useEffect(() => {
    const fetchLatestResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/results/my-results/latest?limit=6', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setResults(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching latest results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestResults();
  }, []);

  // Handle navigation to specific result in Results page
  const handleSubjectClick = (result) => {
    // Navigate to Results page with specific level expanded
    navigate('/dash/results', { 
      state: { 
        expandLevel: result.level.toString(),
        expandSemester: `semester-${result.semester}`,
        highlightSubject: result.code
      }
    });
  };

  // Handle view all results
  const handleViewAllResults = () => {
    navigate('/dash/results');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full -ml-8 -mb-8 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-5 gap-2">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" />
            Latest Results
          </h2>
          <button
            onClick={handleViewAllResults}
            className="flex items-center justify-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group/btn px-3 py-2 rounded-lg hover:bg-blue-50 w-full sm:w-auto"
          >
            View All
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Results List */}
            <div className="space-y-2 sm:space-y-3 flex-grow">
              {results.map((result, index) => (
            <div 
              key={index} 
              onClick={() => handleSubjectClick(result)}
              className="group/item cursor-pointer flex items-start p-2.5 sm:p-3 border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white rounded-lg hover:shadow-md hover:from-blue-100 hover:to-blue-50 transition-all duration-200 transform md:hover:-translate-y-1 active:scale-95 md:hover:scale-[1.02]"
            >
              {/* Subject Icon */}
              <div className="flex-shrink-0 mr-2 sm:mr-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover/item:bg-blue-200 transition-colors duration-200">
                  <AcademicCapIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                </div>
              </div>

              {/* Result Details */}
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs sm:text-base font-semibold text-gray-800 group-hover/item:text-blue-700 transition-colors duration-200 truncate">
                      {result.subject}
                    </h3>
                    <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                      <span className="text-[10px] sm:text-sm text-gray-600 truncate">
                        {result.level} Level
                      </span>
                      <span className="text-[9px] sm:text-xs bg-blue-100 text-blue-800 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                        Sem {result.semester}
                      </span>
                    </div>
                  </div>
                  
                  {/* Grade Display */}
                  <div className="flex flex-col items-end flex-shrink-0">
                    <span className={`font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-white shadow-sm text-xs sm:text-sm ${
                      result.grade === 'A+' || result.grade === 'A' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
                      result.grade === 'B+' || result.grade === 'B' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                      result.grade === 'C+' || result.grade === 'C' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                      'bg-gradient-to-r from-red-500 to-red-600'
                    }`}>
                      {result.grade}
                    </span>
                    {result.updateDate && (
                      <div className="flex items-center mt-0.5 sm:mt-1 text-[9px] sm:text-xs text-gray-500">
                        <CalendarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0" />
                        <span className="truncate">{result.updateDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Update notification if recent */}
                {result.isNew && (
                  <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Recently Updated
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium mb-1">No recent results available</p>
              <p className="text-gray-400 text-sm mb-4">Check back later for updates</p>
              <button
                onClick={handleViewAllResults}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                View All Results
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        {results.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{results.length} recent update{results.length !== 1 ? 's' : ''}</span>
              <Link 
                to="/dash/results"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                View detailed results →
              </Link>
            </div>
          </div>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default LastUpdatedResults;