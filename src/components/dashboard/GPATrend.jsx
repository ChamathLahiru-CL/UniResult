import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import GPAChart from './GPAChart';

/**
 * GPATrend Component
 * Displays a line chart showing GPA progress over months
 * Uses the GPAChart component for visualization
 */
const GPATrend = () => {
  const navigate = useNavigate();
  
  // Mock data for the chart
  const chartData = {
    values: [3.65, 3.70, 3.80, 3.85, 3.70, 3.75, 3.80, 3.85],
    projected: [3.75, 3.80, 3.85, 3.90],
    labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full -ml-20 -mt-20 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mb-16 opacity-40"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            GPA Trend
          </h2>
          <button
            onClick={() => navigate('/dash/gpa-trend')}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group/btn"
          >
            View Analysis
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Chart container with enhanced styling */}
        <div className="relative h-56 bg-gradient-to-b from-white to-blue-50 rounded-lg border border-blue-100 p-3">
          <GPAChart 
            data={chartData.values.slice(0, 6)} // Show only first 6 months in dashboard
            labels={chartData.labels.slice(0, 6)}
            compact={true}
          />
          
          {/* Progress indicator labels */}
          <div className="absolute top-3 right-3 flex items-center space-x-2">
            <div className="px-3 py-1 bg-white rounded-full shadow-sm border border-blue-100 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-xs font-medium text-gray-600">Performance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPATrend;