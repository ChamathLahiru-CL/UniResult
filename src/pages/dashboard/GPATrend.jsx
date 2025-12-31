import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  DocumentChartBarIcon
} from '@heroicons/react/24/outline';
import GPAChart from '../../components/dashboard/GPAChart';
import '../../components/dashboard/GPAComponents.css';

const GPATrend = () => {
  const location = useLocation();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trendData, setTrendData] = useState(null);
  
  // Fetch GPA trend data from backend
  useEffect(() => {
    const fetchGPATrend = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch both analytics and trend data
        const [analyticsRes, trendRes] = await Promise.all([
          fetch('http://localhost:5000/api/gpa/analytics', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }),
          fetch('http://localhost:5000/api/gpa/trend', {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          })
        ]);

        if (analyticsRes.ok && trendRes.ok) {
          const analyticsData = await analyticsRes.json();
          const trendResult = await trendRes.json();
          
          if (analyticsData.success && trendResult.success) {
            // Transform data for the component
            const levels = analyticsData.data.levels || {};
            const trend = trendResult.data || {};
            
            // Build byLevel data
            const byLevel = {};
            Object.entries(levels).forEach(([levelKey, levelData]) => {
              const levelNum = levelKey.replace(/\D/g, '');
              byLevel[levelNum] = {
                average: levelData.gpa,
                trend: levelData.trend || (levelData.gpa ? 'stable' : 'projected'),
                improvement: levelData.trendValue > 0 ? levelData.trendValue : undefined,
                decline: levelData.trendValue < 0 ? Math.abs(levelData.trendValue) : undefined,
                projection: !levelData.gpa ? analyticsData.data.overall.projectedGPA : undefined,
                semesters: levelData.semesters || []
              };
            });

            // Build history from trend data
            const history = (trend.semesters || []).map((sem, index) => ({
              semester: sem.semester || `${index + 1}${getSemesterSuffix(index + 1)}`,
              gpa: sem.gpa,
              level: getLevelFromSemester(index + 1)
            }));

            setTrendData({
              overall: {
                current: analyticsData.data.overall.currentGPA,
                history: history,
                projected: [],
                cumulativeGPA: trend.cumulativeGPA || [],
                targetGPA: trend.targetGPA || 3.80
              },
              byLevel: byLevel,
              hasResults: analyticsData.data.hasResults
            });
          } else {
            setError('Failed to fetch GPA data');
          }
        } else {
          setError('Failed to fetch GPA data');
        }
      } catch (err) {
        console.error('Error fetching GPA trend:', err);
        setError('Error fetching GPA trend data');
      } finally {
        setLoading(false);
      }
    };

    fetchGPATrend();
  }, []);

  // Helper to get semester suffix (1st, 2nd, 3rd, etc.)
  const getSemesterSuffix = (num) => {
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  // Helper to determine level from semester number
  const getLevelFromSemester = (semesterNum) => {
    if (semesterNum <= 2) return '100';
    if (semesterNum <= 4) return '200';
    if (semesterNum <= 6) return '300';
    return '400';
  };
  
  useEffect(() => {
    if (location.state?.selectedLevel) {
      setSelectedLevel(location.state.selectedLevel);
      // Clear navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading GPA Trend Data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !trendData) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">{error || 'No GPA data available'}</p>
          <p className="text-sm text-gray-500">Please check back after results are uploaded</p>
        </div>
      </div>
    );
  }

  // Show no results state
  if (!trendData.hasResults) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No results found</p>
          <p className="text-sm text-gray-500">Your GPA trend will appear here once results are available</p>
        </div>
      </div>
    );
  }

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

            {selectedLevel === level && trendData.byLevel[level]?.semesters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">Semester Breakdown</div>
                  {trendData.byLevel[level].semesters.map((sem, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{sem.semester}</span>
                        <span className={`font-medium ${
                          sem.gpa >= 3.7 ? 'text-green-600' :
                          sem.gpa >= 3.0 ? 'text-blue-600' :
                          sem.gpa > 0 ? 'text-yellow-600' :
                          'text-gray-400'
                        }`}>
                          {sem.gpa > 0 ? sem.gpa : (sem.status === 'in-progress' ? 'In Progress' : '--')}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* GPA Progress Chart */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <DocumentChartBarIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">GPA Progress Chart</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 bg-blue-50 rounded-full flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Current Progress</span>
            </div>
            <div className="px-3 py-1 bg-gray-50 rounded-full flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Projected</span>
            </div>
          </div>
        </div>
        <div className="h-80">
          <GPAChart 
            data={trendData.overall.history.map(sem => sem.gpa).filter(gpa => gpa > 0)}
            labels={trendData.overall.history.filter(sem => sem.gpa > 0).map(sem => sem.semester)}
            targetGPA={trendData.overall.targetGPA}
            showTarget={true}
          />
        </div>
      </div>
    </div>
  );
};

export default GPATrend;