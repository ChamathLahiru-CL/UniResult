import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import './GPAComponents.css';

/**
 * Enhanced GPA Summary Component
 * Displays level-wise GPA breakdown with navigation to detailed analytics
 * Features: Level-wise display, navigation, hover animations, responsive design
 */
const GPASummary = ({ 
  overallGPA = 0, 
  semester = 0,
  levelGPAs = {
    100: null,
    200: null,
    300: null,
    400: null
  },
  loading = false
}) => {
  const navigate = useNavigate();

  // Handle navigation to specific level in GPA Trend
  const handleLevelClick = (level) => {
    navigate('/dash/gpa-trend', { 
      state: { 
        selectedLevel: level.toString()
      }
    });
  };

  // Handle view all trends
  const handleViewAllAnalytics = () => {
    navigate('/dash/gpa-trend');
  };

  // Get color and status for GPA based on value
  const getGPAColor = (gpa) => {
    if (!gpa) return { 
      text: 'text-gray-400', 
      bg: 'from-gray-50 to-gray-100', 
      border: 'border-gray-200',
      status: 'Pending',
      statusColor: 'text-gray-500 bg-gray-100',
      progressColor: 'bg-gray-300'
    };
    if (gpa >= 3.7) return { 
      text: 'text-green-600', 
      bg: 'from-green-50 to-green-100', 
      border: 'border-green-200',
      status: 'Excellent',
      statusColor: 'text-green-600 bg-green-100',
      progressColor: 'bg-green-500'
    };
    if (gpa >= 3.0) return { 
      text: 'text-blue-600', 
      bg: 'from-blue-50 to-blue-100', 
      border: 'border-blue-200',
      status: 'Good',
      statusColor: 'text-blue-600 bg-blue-100',
      progressColor: 'bg-blue-500'
    };
    if (gpa >= 2.5) return { 
      text: 'text-yellow-600', 
      bg: 'from-yellow-50 to-yellow-100', 
      border: 'border-yellow-200',
      status: 'Fair',
      statusColor: 'text-yellow-600 bg-yellow-100',
      progressColor: 'bg-yellow-500'
    };
    return { 
      text: 'text-red-600', 
      bg: 'from-red-50 to-red-100', 
      border: 'border-red-200',
      status: 'Needs Improvement',
      statusColor: 'text-red-600 bg-red-100',
      progressColor: 'bg-red-500'
    };
  };

  // Determine current level based on semester
  const getCurrentLevel = () => {
    if (semester <= 2) return '100';
    if (semester <= 4) return '200';
    if (semester <= 6) return '300';
    return '400';
  };

  const currentLevel = getCurrentLevel();

  // Loading state
  if (loading) {
    return (
      <div className="gpa-card bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden">
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-sm text-gray-500">Loading GPA data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="gpa-card bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative elements */}
      <div className="gpa-decorative absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="gpa-decorative absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full -ml-8 -mb-8 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-500 flex-shrink-0" />
            <span>GPA Summary</span>
          </h2>
          <button
            onClick={handleViewAllAnalytics}
            className="analytics-button flex items-center justify-center text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group/btn px-3 py-2 rounded-lg hover:bg-blue-50 w-full sm:w-auto"
          >
            <span>View GPA Trend</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>

        {/* Overall GPA Highlight */}
        <div className="gpa-hover-lift mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 sm:p-3 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer"
             onClick={handleViewAllAnalytics}>
          <div className="flex items-center justify-between">
            <div>
              <span className="gpa-number text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {overallGPA}
              </span>
              <div className="mt-0.5 flex items-center">
                <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500 mr-1.5 sm:mr-2"></span>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Overall GPA</p>
              </div>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
              <AcademicCapIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Level-wise GPA Grid */}
        <div className="flex-1 space-y-1.5 sm:space-y-2 mt-2">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Level-wise Performance</h3>
          
          <div className="gpa-level-grid grid grid-cols-2 gap-2 sm:gap-3">
            {Object.entries(levelGPAs).map(([level, gpa]) => {
              const colors = getGPAColor(gpa);
              const isCurrentLevel = level === currentLevel;
              const gpaPercentage = gpa ? Math.min((gpa / 4.0) * 100, 100) : 0;
              
              return (
                <div
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`gpa-level-card gpa-click-effect p-2.5 sm:p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer transform md:hover:scale-105 active:scale-95 hover:shadow-md bg-gradient-to-br ${colors.bg} ${colors.border} hover:border-opacity-80 group/card flex flex-col h-full`}
                >
                  {/* Header with Level and Status Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider">
                      {level} Level
                    </span>
                    {gpa && (
                      <span className={`text-[9px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${colors.statusColor}`}>
                        {colors.status}
                      </span>
                    )}
                    {!gpa && (
                      <span className={`text-[9px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${colors.statusColor}`}>
                        {colors.status}
                      </span>
                    )}
                  </div>

                  {/* GPA Display with Current Indicator */}
                  <div className="flex items-baseline justify-between mb-1.5">
                    <div className="flex-1">
                      <span className={`text-2xl sm:text-3xl font-bold ${colors.text} group-hover/card:scale-110 transition-transform duration-200 inline-block`}>
                        {gpa || '--'}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">/4.0</span>
                    </div>
                    {gpa && (
                      <div className={`trend-icon p-1.5 sm:p-2 rounded-lg opacity-70 group-hover/card:opacity-100 transition-opacity duration-200 ${colors.bg}`}>
                        {gpa >= 3.5 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                        ) : gpa >= 3.0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                        )}
                      </div>
                    )}
                    {isCurrentLevel && (
                      <div className="current-level-indicator flex items-center ml-2">
                        <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] text-gray-600 font-medium">Performance</span>
                      <span className="text-[9px] text-gray-500">{Math.round(gpaPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 bg-opacity-40 rounded-full h-2">
                      <div 
                        className={`${colors.progressColor} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${gpaPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Semester Info and Current Level Badge */}
                  <div className="flex items-center justify-between text-[9px] text-gray-600 mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Semester Info:</span>
                      <span className="font-semibold text-gray-700">{level === '100' ? '1-2' : level === '200' ? '3-4' : level === '300' ? '5-6' : '7-8'}</span>
                    </div>
                  </div>

                  {/* Current Level Indicator with Semester Progress */}
                  {isCurrentLevel && gpa && (
                    <div className="mt-auto pt-2 border-t border-opacity-30 border-current">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-medium text-gray-700">Current Progress</span>
                            <span className="text-[9px] font-semibold text-blue-600">Sem {semester}/8</span>
                          </div>
                          <div className="w-full bg-gray-200 bg-opacity-40 rounded-full h-1.5">
                            <div 
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${(semester / 8) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State Message */}
                  {!gpa && (
                    <div className="mt-auto pt-2 border-t border-opacity-30 border-current">
                      <p className="text-[8px] text-gray-500 italic">Results not yet available</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <button
              onClick={handleViewAllAnalytics}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              View GPA Trend Analysis
            </button>
            <span className="text-gray-500">
              Updated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPASummary;