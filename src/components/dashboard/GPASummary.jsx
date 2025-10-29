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
  overallGPA = 3.75, 
  semester = 5,
  levelGPAs = {
    100: 3.65,
    200: 3.80,
    300: 3.70,
    400: null
  }
}) => {
  const navigate = useNavigate();

  // Handle navigation to specific level in GPA Analytics
  const handleLevelClick = (level) => {
    navigate('/dash/gpa-analytics', { 
      state: { 
        highlightLevel: level.toString()
      }
    });
  };

  // Handle view all analytics
  const handleViewAllAnalytics = () => {
    navigate('/dash/gpa-analytics');
  };

  // Get color for GPA based on value
  const getGPAColor = (gpa) => {
    if (!gpa) return { text: 'text-gray-400', bg: 'from-gray-50 to-gray-100', border: 'border-gray-200' };
    if (gpa >= 3.7) return { text: 'text-green-600', bg: 'from-green-50 to-green-100', border: 'border-green-200' };
    if (gpa >= 3.0) return { text: 'text-blue-600', bg: 'from-blue-50 to-blue-100', border: 'border-blue-200' };
    if (gpa >= 2.5) return { text: 'text-yellow-600', bg: 'from-yellow-50 to-yellow-100', border: 'border-yellow-200' };
    return { text: 'text-red-600', bg: 'from-red-50 to-red-100', border: 'border-red-200' };
  };

  return (
    <div className="gpa-card bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Decorative elements */}
      <div className="gpa-decorative absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full -mr-12 -mt-12 opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="gpa-decorative absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-full -ml-8 -mb-8 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative z-10 h-full flex flex-col">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
            GPA Summary
          </h2>
          <button
            onClick={handleViewAllAnalytics}
            className="analytics-button flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group/btn"
          >
            <span>View Analytics</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>

        {/* Overall GPA Highlight */}
        <div className="gpa-hover-lift mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300 cursor-pointer"
             onClick={handleViewAllAnalytics}>
          <div className="flex items-center justify-between">
            <div>
              <span className="gpa-number text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {overallGPA}
              </span>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
                <p className="text-sm font-medium text-gray-600">Overall GPA</p>
              </div>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <AcademicCapIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Level-wise GPA Grid */}
        <div className="flex-1 space-y-3">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Level-wise Performance</h3>
          
          <div className="gpa-level-grid grid grid-cols-2 gap-3">
            {Object.entries(levelGPAs).map(([level, gpa]) => {
              const colors = getGPAColor(gpa);
              const isCurrentLevel = level === '300'; // 5th semester = 300 level
              
              return (
                <div
                  key={level}
                  onClick={() => handleLevelClick(level)}
                  className={`gpa-level-card gpa-click-effect p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-md bg-gradient-to-br ${colors.bg} ${colors.border} hover:border-opacity-80 group/card`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {level} Level
                    </span>
                    {isCurrentLevel && (
                      <div className="current-level-indicator flex items-center">
                        <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-xs text-blue-600 ml-1">Current</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-lg font-bold ${colors.text} group-hover/card:scale-110 transition-transform duration-200`}>
                      {gpa || '--'}
                    </span>
                    {gpa && (
                      <div className={`trend-icon p-1 rounded ${colors.bg} opacity-70 group-hover/card:opacity-100 transition-opacity duration-200`}>
                        {gpa >= 3.5 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 text-green-500" />
                        ) : gpa >= 3.0 ? (
                          <ArrowTrendingUpIcon className="h-3 w-3 text-blue-500" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-3 w-3 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Progress indicator for current level */}
                  {isCurrentLevel && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div className="gpa-progress-bar bg-blue-500 h-1 rounded-full w-1/2 transition-all duration-300 group-hover/card:w-3/5"></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">Semester {semester}/8</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs">
            <button
              onClick={handleViewAllAnalytics}
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              Detailed Analysis
            </button>
            <span className="text-gray-500">
              Updated: Oct 29, 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPASummary;