import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon
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
    <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header with Stats */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">GPA Trend Analysis</h1>
                <p className="text-blue-100 text-sm sm:text-base">Complete academic performance overview</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[140px]">
              <div className="text-4xl font-bold text-white">{trendData.overall.current}</div>
              <div className="text-xs text-blue-100 mt-1 flex items-center justify-center">
                <TrophyIcon className="h-4 w-4 mr-1" />
                Current CGPA
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(trendData.byLevel).filter(l => l.average).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Levels Completed</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              {trendData.overall.history.filter(h => h.gpa > 0).length}
            </div>
            <div className="text-xs text-gray-600 mt-1">Semesters Done</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">
              {Math.max(...Object.values(trendData.byLevel).map(l => l.average || 0)).toFixed(2)}
            </div>
            <div className="text-xs text-gray-600 mt-1">Highest GPA</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">
              {trendData.overall.targetGPA || '3.80'}
            </div>
            <div className="text-xs text-gray-600 mt-1">Target GPA</div>
          </div>
        </div>
      </div>

      {/* Level Cards - Enhanced with Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Object.entries(trendData.byLevel).map(([level, data]) => {
          const isExpanded = selectedLevel === level;
          const completedSemesters = data.semesters?.filter(s => s.gpa > 0).length || 0;
          const totalSemesters = 2;
          const completionRate = (completedSemesters / totalSemesters) * 100;
          const hasData = data.average > 0;
          
          return (
            <div
              key={level}
              className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                isExpanded
                  ? 'border-blue-400 shadow-2xl scale-105 md:scale-110 z-10' 
                  : hasData 
                    ? 'border-gray-200 hover:border-blue-300 hover:shadow-xl' 
                    : 'border-gray-100 hover:border-gray-200 opacity-75'
              }`}
              onClick={() => setSelectedLevel(isExpanded ? null : level)}
            >
              {/* Decorative Elements */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 transition-opacity duration-300 ${
                hasData ? 'bg-gradient-to-br from-blue-100 to-indigo-100 opacity-50' : 'bg-gray-100 opacity-30'
              } group-hover:opacity-70`}></div>
              <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full -ml-12 -mb-12 transition-opacity duration-300 ${
                hasData ? 'bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-40' : 'bg-gray-50 opacity-20'
              } group-hover:opacity-60`}></div>
              
              <div className="relative p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${
                      hasData 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                        : 'bg-gray-300'
                    }`}>
                      <AcademicCapIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{level} Level</h3>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <ClockIcon className="h-3 w-3" />
                        <span>{completedSemesters}/{totalSemesters} Semesters</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Trend Indicator */}
                  {hasData && (
                    <div className={`p-2 rounded-full ${
                      data.trend === 'up' ? 'bg-green-100' :
                      data.trend === 'down' ? 'bg-red-100' :
                      'bg-blue-100'
                    }`}>
                      {data.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                      ) : data.trend === 'down' ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-red-600 transform rotate-180" />
                      ) : (
                        <ArrowPathIcon className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  )}
                </div>
                
                {/* Main GPA Display */}
                <div className="mb-4">
                  <div className="flex items-end space-x-2">
                    <div className={`text-4xl font-bold ${
                      hasData 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent' 
                        : 'text-gray-300'
                    }`}>
                      {data.average || '--'}
                    </div>
                    {hasData && (
                      <div className="text-sm text-gray-500 pb-1">/ 4.0</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="text-sm font-medium text-gray-600">
                      {hasData ? 'Level GPA' : 'Not Started'}
                    </div>
                    {data.trend !== 'projected' && hasData && (
                      <div className={`text-xs font-semibold ${
                        data.trend === 'up' ? 'text-green-600' :
                        data.trend === 'down' ? 'text-red-600' :
                        'text-blue-600'
                      }`}>
                        {data.trend === 'up' && `↑ ${data.improvement}`}
                        {data.trend === 'down' && `↓ ${data.decline}`}
                        {data.trend === 'stable' && '→ Stable'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-semibold">{completionRate.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        completionRate === 100 
                          ? 'bg-gradient-to-r from-green-500 to-green-600' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                      }`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                {hasData && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5">
                      <div className="flex items-center space-x-2">
                        <BookOpenIcon className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="text-xs text-gray-600">Courses</div>
                          <div className="text-sm font-bold text-blue-700">
                            {data.semesters?.reduce((acc, sem) => acc + (sem.courses || 0), 0) || completedSemesters * 4}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2.5">
                      <div className="flex items-center space-x-2">
                        <SparklesIcon className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="text-xs text-gray-600">Best</div>
                          <div className="text-sm font-bold text-green-700">
                            {Math.max(...(data.semesters?.map(s => s.gpa) || [data.average])).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Projected GPA for incomplete levels */}
                {!hasData && data.projection && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-blue-100 rounded-full">
                        <ChartBarIcon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Projected GPA</div>
                        <div className="text-lg font-bold text-blue-700">{data.projection}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand/Collapse Button */}
                <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  <span>{isExpanded ? 'Hide Details' : 'View Semester Breakdown'}</span>
                  {isExpanded ? (
                    <ChevronUpIcon className="h-4 w-4" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4" />
                  )}
                </button>

                {/* Expanded Details */}
                {isExpanded && data.semesters && data.semesters.length > 0 && (
                  <div className="mt-4 pt-4 border-t-2 border-gray-100 space-y-3 animate-fadeIn">
                    <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                      <DocumentChartBarIcon className="h-4 w-4 text-blue-600" />
                      <span>Semester Performance</span>
                    </div>
                    {data.semesters.map((sem, idx) => (
                      <div 
                        key={idx} 
                        className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                          sem.gpa > 0 
                            ? 'bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            sem.gpa >= 3.7 ? 'bg-green-100' :
                            sem.gpa >= 3.0 ? 'bg-blue-100' :
                            sem.gpa > 0 ? 'bg-yellow-100' :
                            'bg-gray-100'
                          }`}>
                            {sem.gpa > 0 ? (
                              <CheckCircleIcon className={`h-4 w-4 ${
                                sem.gpa >= 3.7 ? 'text-green-600' :
                                sem.gpa >= 3.0 ? 'text-blue-600' :
                                'text-yellow-600'
                              }`} />
                            ) : (
                              <ClockIcon className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">{sem.semester}</div>
                            <div className="text-xs text-gray-500">
                              {sem.courses || 4} courses • {sem.credits || 12} credits
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            sem.gpa >= 3.7 ? 'text-green-600' :
                            sem.gpa >= 3.0 ? 'text-blue-600' :
                            sem.gpa > 0 ? 'text-yellow-600' :
                            'text-gray-400'
                          }`}>
                            {sem.gpa > 0 ? sem.gpa.toFixed(2) : '--'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {sem.gpa > 0 ? 'Completed' : sem.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* GPA Progress Chart */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl flex-shrink-0">
                <DocumentChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">Semester-wise GPA Progress</h2>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Visual representation of your academic journey</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 whitespace-nowrap">Your GPA</span>
              </div>
              <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 whitespace-nowrap">Target: {trendData.overall.targetGPA}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 sm:p-6">
          <div className="h-64 sm:h-80 lg:h-96">
            <GPAChart 
              data={trendData.overall.history.map(sem => sem.gpa).filter(gpa => gpa > 0)}
              labels={trendData.overall.history.filter(sem => sem.gpa > 0).map(sem => sem.semester)}
              targetGPA={trendData.overall.targetGPA}
              showTarget={true}
            />
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 text-white">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
          <h3 className="text-base sm:text-xl font-bold">Performance Insights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {(Object.values(trendData.byLevel).reduce((acc, l) => acc + (l.average || 0), 0) / 
                Object.values(trendData.byLevel).filter(l => l.average).length || 1).toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-blue-100">Average Across All Levels</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {Object.values(trendData.byLevel).filter(l => l.trend === 'up').length}
            </div>
            <div className="text-xs sm:text-sm text-blue-100">Levels with Improvement</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="text-xl sm:text-2xl font-bold mb-1">
              {trendData.overall.history.filter(h => h.gpa >= 3.5).length}
            </div>
            <div className="text-xs sm:text-sm text-blue-100">Semesters Above 3.5</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPATrend;