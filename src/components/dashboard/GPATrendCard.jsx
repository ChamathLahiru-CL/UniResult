import React from 'react';
import { ChartBarIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import GPAChart from './GPAChart';

/**
 * GPATrendCard Component
 * Displays a compact GPA trend chart with navigation to detailed analysis
 */
const GPATrendCard = () => {
  const navigate = useNavigate();

  // Sample data for the chart
  const chartData = {
    labels: ['1st', '2nd', '3rd', '4th', '5th'],
    values: [3.65, 3.70, 3.80, 3.85, 3.70]
  };

  const handleClick = () => {
    navigate('/dash/gpa-analytics');
  };

  return (
    <div className="relative z-10">
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
        <ChartBarIcon className="w-5 h-5 mr-2 text-blue-500" />
        GPA Trend
      </h2>
      <div 
        onClick={handleClick}
        className="relative h-56 bg-gradient-to-b from-white to-blue-50 rounded-lg border border-blue-100 p-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-200 group"
      >
        <div className="w-full h-full">
          <GPAChart data={chartData} compact={true} />
        </div>
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow-sm border border-blue-100 flex items-center group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-xs font-medium text-gray-600">Performance</span>
        </div>
      </div>
    </div>
  );
};

export default GPATrendCard;