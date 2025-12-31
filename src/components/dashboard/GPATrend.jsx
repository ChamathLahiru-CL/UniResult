import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import GPAChart from './GPAChart';

/**
 * GPATrend Component
 * Displays a line chart showing GPA progress from backend data
 * Clickable to navigate to GPA Analytics page
 */
const GPATrend = () => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState({
    values: [],
    labels: [],
    loading: true
  });

  // Fetch GPA trend data from backend
  useEffect(() => {
    const fetchGPATrend = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/gpa/analytics', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.hasResults) {
            // Extract semester-wise GPA data from all levels
            const semesterData = [];
            const semesterLabels = [];
            
            // Collect all semesters from all levels
            Object.values(result.data.levels).forEach(levelData => {
              if (levelData.semesters && levelData.semesters.length > 0) {
                levelData.semesters.forEach(sem => {
                  if (sem.gpa > 0) {
                    semesterData.push(sem.gpa);
                    semesterLabels.push(sem.semester.replace(' Semester', '').replace('st', '').replace('nd', '').replace('rd', '').replace('th', '') + 'S');
                  }
                });
              }
            });

            setChartData({
              values: semesterData,
              labels: semesterLabels,
              loading: false
            });
          } else {
            // No results yet
            setChartData({
              values: [],
              labels: [],
              loading: false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching GPA trend:', error);
        setChartData({
          values: [],
          labels: [],
          loading: false
        });
      }
    };

    fetchGPATrend();
  }, []);

  // Navigate to GPA Analytics page
  const handleNavigate = () => {
    navigate('/dash/gpa-analytics');
  };

  // Calculate statistics
  const currentGPA = chartData.values.length > 0 ? chartData.values[chartData.values.length - 1] : 0;
  const previousGPA = chartData.values.length > 1 ? chartData.values[chartData.values.length - 2] : 0;
  const trendDirection = currentGPA > previousGPA ? 'up' : currentGPA < previousGPA ? 'down' : 'stable';
  const highestGPA = chartData.values.length > 0 ? Math.max(...chartData.values) : 0;
  
  // Determine performance level
  const getPerformanceLevel = (gpa) => {
    if (gpa >= 3.7) return { text: 'Excellent', color: 'text-green-600', bg: 'bg-green-50', icon: '🌟' };
    if (gpa >= 3.3) return { text: 'Good', color: 'text-blue-600', bg: 'bg-blue-50', icon: '👍' };
    if (gpa >= 3.0) return { text: 'Average', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '✓' };
    return { text: 'Needs Work', color: 'text-red-600', bg: 'bg-red-50', icon: '⚠️' };
  };
  
  const performance = getPerformanceLevel(currentGPA);

  return (
    <div 
      className="bg-white p-5 rounded-xl shadow-md border border-gray-200 h-full overflow-hidden relative cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-blue-300 group"
      onClick={handleNavigate}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-blue-50 rounded-full -ml-20 -mt-20 opacity-50 group-hover:opacity-70 transition-opacity"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mb-16 opacity-40 group-hover:opacity-60 transition-opacity"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 flex items-center group-hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              GPA Progress Tracker
            </h2>
            <p className="text-xs text-gray-500 mt-1 ml-7">Track your academic performance</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/dash/gpa-analytics');
            }}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group/btn px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            Details
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Statistics Cards */}
        {!chartData.loading && chartData.values.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {/* Current GPA */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium mb-1">Current GPA</p>
              <p className="text-xl font-bold text-blue-700">{currentGPA.toFixed(2)}</p>
              <div className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full ${performance.bg}`}>
                <span className="text-xs mr-1">{performance.icon}</span>
                <span className={`text-xs font-medium ${performance.color}`}>{performance.text}</span>
              </div>
            </div>
            
            {/* Trend */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2.5 border border-purple-200">
              <p className="text-xs text-purple-600 font-medium mb-1">Trend</p>
              <div className="flex items-center mt-2">
                {trendDirection === 'up' && (
                  <>
                    <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-semibold text-green-600 ml-1">Rising</span>
                  </>
                )}
                {trendDirection === 'down' && (
                  <>
                    <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <span className="text-sm font-semibold text-red-600 ml-1">Falling</span>
                  </>
                )}
                {trendDirection === 'stable' && (
                  <>
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-600 ml-1">Stable</span>
                  </>
                )}
              </div>
              {previousGPA > 0 && (
                <p className="text-xs text-purple-600 mt-1">
                  {trendDirection === 'up' ? '+' : trendDirection === 'down' ? '-' : ''}
                  {Math.abs(currentGPA - previousGPA).toFixed(2)}
                </p>
              )}
            </div>
            
            {/* Best Performance */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2.5 border border-green-200">
              <p className="text-xs text-green-600 font-medium mb-1">Highest</p>
              <p className="text-xl font-bold text-green-700">{highestGPA.toFixed(2)}</p>
              <p className="text-xs text-green-600 mt-1">
                {chartData.values.length} semester{chartData.values.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
        
        {/* Chart container */}
        <div className="relative h-52 bg-gradient-to-b from-white to-blue-50 rounded-lg border border-blue-100 p-3 group-hover:border-blue-200 transition-colors">
          {chartData.loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600 mb-3"></div>
              <p className="text-sm text-gray-500">Loading your performance data...</p>
            </div>
          ) : chartData.values.length > 0 ? (
            <GPAChart 
              data={chartData.values}
              labels={chartData.labels}
              compact={true}
              targetGPA={3.7}
              showTarget={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg className="w-16 h-16 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium">No GPA data available yet</p>
              <p className="text-xs mt-1">Complete your first semester to see progress</p>
            </div>
          )}
        </div>
        
        {/* Helper text */}
        {!chartData.loading && chartData.values.length > 0 && (
          <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Click for detailed semester-wise analysis and insights
          </div>
        )}
      </div>
    </div>
  );
};

export default GPATrend;