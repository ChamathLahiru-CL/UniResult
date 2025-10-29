import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import '../../components/dashboard/GPAComponents.css';

const GPATrend = () => {
  const location = useLocation();
  const [selectedLevel, setSelectedLevel] = useState(null);
  
  useEffect(() => {
    if (location.state?.selectedLevel) {
      setSelectedLevel(location.state.selectedLevel);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Mock trend data
  const trendData = {
    overall: {
      current: 3.75,
      history: [
        { semester: '1st', gpa: 3.65, level: '100' },
        { semester: '2nd', gpa: 3.70, level: '100' },
        { semester: '3rd', gpa: 3.80, level: '200' },
        { semester: '4th', gpa: 3.85, level: '200' },
        { semester: '5th', gpa: 3.70, level: '300' }
      ],
      projected: [
        { semester: '6th', gpa: 3.75, level: '300' },
        { semester: '7th', gpa: 3.80, level: '400' },
        { semester: '8th', gpa: 3.85, level: '400' }
      ]
    },
    byLevel: {
      '100': { average: 3.68, trend: 'up', improvement: 0.05 },
      '200': { average: 3.83, trend: 'up', improvement: 0.15 },
      '300': { average: 3.70, trend: 'down', decline: 0.13 },
      '400': { average: null, trend: 'projected', projection: 3.83 }
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GPA Trend Analysis</h1>
              <p className="text-gray-600">Track your academic performance over time</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{trendData.overall.current}</div>
            <div className="text-sm text-gray-500">Current GPA</div>
          </div>
        </div>
      </div>

      {/* Trend Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(trendData.byLevel).map(([level, data]) => (
          <div
            key={level}
            className={`gpa-level-card p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
              selectedLevel === level 
                ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100' 
                : 'border-gray-200 bg-gradient-to-br from-gray-50 to-white'
            }`}
            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{level} Level</h3>
              {data.trend === 'up' ? (
                <div className="trend-icon text-green-600">
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                </div>
              ) : data.trend === 'down' ? (
                <div className="trend-icon text-red-600">
                  <ArrowTrendingUpIcon className="h-5 w-5 transform rotate-180" />
                </div>
              ) : (
                <div className="trend-icon text-blue-600">
                  <ArrowPathIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  {data.average || '--'}
                </div>
                <div className="text-sm text-gray-500">Average GPA</div>
              </div>
              
              <div className="text-sm">
                {data.trend === 'up' && (
                  <div className="text-green-600">
                    ▲ {data.improvement} improvement
                  </div>
                )}
                {data.trend === 'down' && (
                  <div className="text-red-600">
                    ▼ {data.decline} decline
                  </div>
                )}
                {data.trend === 'projected' && (
                  <div className="text-blue-600">
                    → {data.projection} projected
                  </div>
                )}
              </div>
            </div>

            {selectedLevel === level && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Semester Breakdown</div>
                  {trendData.overall.history
                    .concat(trendData.overall.projected)
                    .filter(sem => sem.level === level)
                    .map((sem, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{sem.semester} Semester</span>
                        <span className={`font-medium ${
                          sem.gpa >= 3.7 ? 'text-green-600' :
                          sem.gpa >= 3.0 ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {sem.gpa}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trend Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">GPA Progress Chart</h2>
        </div>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500">GPA trend chart will be implemented here</p>
        </div>
      </div>
    </div>
  );
};

export default GPATrend;